import client from '@/db/client';

const findCities = () => client.city.findMany();

const findCommunities = (cityId: string) => client.community.findMany({ where: { cityId } });

const findSubcommunities = (communityId: string) => client.subcommunity.findMany({ where: { communityId } });

const findProperties = (subcommunityId: string) => client.property.findMany({ where: { subcommunityId } });

export default {
  findCities,
  findCommunities,
  findSubcommunities,
  findProperties,
};
