import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import csv from 'csv-parser';
import { PaginationResult } from './constant/types';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import logger from '../config/logger';

/**
 * @fileOverview Helper functions for the application
 */
export default class HelperFunctions {
  /**
   * Reads CSV file and returns paginated results along with pagination details.
   * @param filePath Relative path to the CSV file.
   * @param page Page number for pagination.
   * @param limit Number of items per page.
   * @returns Promise that resolves to an object containing paginated data and pagination details.
   */
  static async readCsv(
    filePath: string,
    page: number,
    limit: number
  ): Promise<PaginationResult> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(__dirname, filePath))
        .pipe(csv())
        .on('data', (rawData) => {
          const formattedData = Object.keys(rawData).reduce((acc, key) => {
            const formattedKey = key
              .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
                index === 0 ? word.toLowerCase() : word.toUpperCase()
              )
              .replace(/\s+/g, '');
            acc[formattedKey] = rawData[key];
            return acc;
          }, {} as any);

          results.push(formattedData);
        })
        .on('end', () => {
          const totalItems = results.length;
          const totalPages = Math.ceil(totalItems / limit);
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;

          const paginatedData = results.slice(startIndex, endIndex);

          resolve({
            data: paginatedData,
            currentPage: page,
            limit: limit,
            totalPages: totalPages,
            totalItems: totalItems,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          });
        })
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Writes data to a CSV file.
   * @param filePath Relative path to the CSV file.
   * @param data Data to be written to the CSV file.
   * @returns Promise that resolves to the data written to the CSV file.
   */
  static async writeCsv(filePath: string, data: any): Promise<any> {
    const fullPath = path.resolve(__dirname, filePath);
    const records = {
      bookName: data.bookName,
      author: data.author,
      year: data.year,
    };

    // Ensure there's a newline at the end of the file before appending
    await HelperFunctions.ensureNewlineAtEndOfFile(fullPath);

    const csvWriter = createCsvWriter({
      path: fullPath,
      header: [
        { id: 'bookName', title: 'Book Name' },
        { id: 'author', title: 'Author' },
        { id: 'year', title: 'Publication Year' },
      ],
      append: true,
    });

    try {
      await csvWriter.writeRecords([records]);
      return records;
    } catch (error) {
      console.error('Error writing to CSV:', error);
      throw error;
    }
  }

  /**
   * @description This method is used to ensure that there is a newline at the end of a file.
   * @param filePath Relative path to the CSV file.
   * @returns Promise that resolves to the data written to the CSV file.
   */
  static async ensureNewlineAtEndOfFile(filePath: string): Promise<void> {
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);

    try {
      let content = await readFile(filePath, { encoding: 'utf-8' });
      if (!content.endsWith('\n')) {
        await writeFile(filePath, '\n', { flag: 'a' }); // Append a newline if it's missing
      }
    } catch (error) {
      logger.error(
        `ensureNewlineAtEndOfFile -> error: ${JSON.stringify(
          (error as Error).message
        )}`
      );
    }
  }

  /**
   * Deletes a row from a CSV file.
   * @param filePath Relative path to the CSV file.
   * @param bookName Name of the book to be deleted.
   * @returns Promise that resolves to the data written to the CSV file.
   */
  // static async deleteRowFromCsv(
  //   filePath: string,
  //   bookName: string
  // ): Promise<any> {
  //   const fullPath = path.resolve(__dirname, filePath);
  //   const tempFilePath = path.resolve(__dirname, 'temp.csv');

  //   const readFile = util.promisify(fs.readFile);
  //   const writeFile = util.promisify(fs.writeFile);
  //   const unlink = util.promisify(fs.unlink);

  //   try {
  //     let content = await readFile(fullPath, { encoding: 'utf-8' });
  //     const newContent = content
  //       .split('\n')
  //       .filter((row) => {
  //         const rowData = row.split(',');
  //         return rowData[0] !== bookName;
  //       })
  //       .join('\n');

  //     await writeFile(tempFilePath, newContent, { flag: 'w' });
  //     await unlink(fullPath);
  //     await fs.promises.rename(tempFilePath, fullPath);

  //     return { message: 'Book deleted successfully', status: 200 };
  //   } catch (error) {
  //     console.error('Error deleting from CSV:', error);
  //     throw error;
  //   }
  // }
  static async deleteRowFromCsv(
    filePath: string,
    bookName: string
  ): Promise<any> {
    const fullPath = path.resolve(__dirname, filePath);
    const tempFilePath = path.resolve(__dirname, 'temp.csv');

    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);
    const unlink = util.promisify(fs.unlink);

    let content = await readFile(fullPath, { encoding: 'utf-8' });
    const newContent = content
      .split('\n')
      .filter((row) => {
        // Assuming the first column contains the book name. Adjust as necessary.
        const rowData = row.split(',');
        // Make the comparison case-insensitive
        if (rowData.length > 0) {
          return rowData[0].toLowerCase() !== bookName.toLowerCase();
        }
        return true; // Keep rows that don't match the format to avoid data loss
      })
      .join('\n');

    await writeFile(tempFilePath, newContent, { flag: 'w' });
    await unlink(fullPath);
    await fs.promises.rename(tempFilePath, fullPath);

    return { message: 'Book deleted successfully', status: 200 };
  }
}
