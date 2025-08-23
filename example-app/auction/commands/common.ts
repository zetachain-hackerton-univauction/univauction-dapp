import { readFileSync } from "fs";
import { join } from "path";

export const getAbi = (contractName: string) => {
  const artifactPath = join(__dirname, "..", "out", `${contractName}.sol`, `${contractName}.json`);
  
  try {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
    return {
      abi: artifact.abi,
      bytecode: artifact.bytecode.object,
    };
  } catch (error) {
    throw new Error(`Failed to read artifact for ${contractName}: ${error}`);
  }
};