﻿import { InvestorTypeCharacter } from '../../models/enums';
import { Bot } from '../../models/trading-bot-model';

export class User {
  _id: string;
  email: string;
  password: string;

  account: number;
  token: string;
  riskType: InvestorTypeCharacter;

  // passwordResetToken: string;
  // passwordResetExpires: Date;

  // facebook: string;
  // tokens: AuthToken[];

  profile: {
    bitrhDate: Date;
    name: string;
    gender: string;
    location: string;
    username: string;
  };

  bots: Bot[]
}
