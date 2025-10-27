import { Request, Response } from 'express';
import feedService from './feed.service';

const getFeed = async (req: Request, res: Response) => {
  const result = await feedService.getFeed();

  res.set('Content-Type', 'text/xml');
  res.send(result);
};

export default {
  getFeed,
};
