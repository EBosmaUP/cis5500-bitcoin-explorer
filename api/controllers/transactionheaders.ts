import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import pool from '../database/db';
import { QueryResult } from 'pg';
import isValidHeight from '../utils/isValidHeight';

interface txids {
  txid: String[];
}

// Returns list of transactions for a given height
// If no height passed - use the max block height from the database
export const getTxs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let height = Number(req.query.height);
    console.log(height)

    // Check if valid height
    let valid: boolean = await isValidHeight(height)
    if (!valid && !Number.isNaN(height)) {
      throw Error('Not a valid height');
    }

    // Specify a height based on if a valid query parameter is available
    let query;
    if (height) {
      query = `
        SELECT hash FROM bitcoin.block_headers WHERE height = ${height};
      `
    } else {
      query = `SELECT
        hash
      FROM
        bitcoin.block_headers
      WHERE
        height IN (SELECT MAX(height) as height FROM bitcoin.block_headers)`
    }

    // get hash given height
    let pgResult: QueryResult<any> = await pool.query(query);
    let blockHashRes: any[] = pgResult.rows;
    let blockHash = blockHashRes[0]['hash'];

    // Create a logic for handling when height given is not a valid block height

    // Get txids for the block
    let txidsResponse: AxiosResponse = await axios.get(
      `https://blockstream.info/api/block/${blockHash}/txids`
    );
    let txids: [txids] = txidsResponse.data;

    return res.status(200).json({
      message: txids,
    });
  } catch (err) {
    next(err);
  }
};

// Get detailed vin and vout for a specific transaction id
export const getTxDetails = async (req: Request, res: Response, next: NextFunction) => {
  let id: string = String(req.params.id);

  // query to get blockheader data
  let txDetailResponse: AxiosResponse = await axios.get(
    `https://blockstream.info/api/tx/${id}`
  );
  let txDetail: any = txDetailResponse.data;

  return res.status(200).json({
    message: txDetail
  })
};

export default {
  getTxs,
  getTxDetails
};
