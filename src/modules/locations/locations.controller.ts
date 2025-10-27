import { Request, Response } from 'express';
import locationsService from './locations.service';

const findCities = async (req: Request, res: Response) => {
  const result = await locationsService.findCities();
  res.send(result);
};

const findCommunities = async (req: Request, res: Response) => {
  const result = await locationsService.findCommunities(req.query.cityId as string);
  res.send(result);
};

const findSubcommunities = async (req: Request, res: Response) => {
  const result = await locationsService.findSubcommunities(req.query.communityId as string);
  res.send(result);
};

const findProperties = async (req: Request, res: Response) => {
  const result = await locationsService.findProperties(req.query.subcommunityId as string);
  res.send(result);
};

export default {
  findCities,
  findCommunities,
  findSubcommunities,
  findProperties,
};
