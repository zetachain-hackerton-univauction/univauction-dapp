#!/usr/bin/env ts-node

import { Command } from "commander";
import { deploy } from "./deploy";
import { auction } from "./auction";

const program = new Command();

program
  .name("auction-cli")
  .description("ZetaChain Auction System CLI")
  .version("1.0.0");

program.addCommand(deploy);
program.addCommand(auction);

program.parse();