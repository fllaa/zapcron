import Papa from "papaparse";

export const parseCsv = async <T>(file: File): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
