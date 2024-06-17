import { UserBiodata } from '@prisma/client';

export class CreateUserBioRequest {
  first_name: string;
  last_name?: string;
  phone_number: string;
  street: string;
  city: string;
  province: string;
  country: string;
}

export class UserBioResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  street: string;
  city: string;
  province: string;
  country: string;
  avatar?: string;
}

export function toUserBioResponse(biodata: UserBiodata): UserBioResponse {
  return {
    id: biodata.id,
    user_id: biodata.user_id,
    first_name: biodata.first_name,
    last_name: biodata.last_name,
    phone_number: biodata.phone_number,
    street: biodata.street,
    city: biodata.city,
    province: biodata.province,
    country: biodata.country,
    avatar: biodata.avatar,
  };
}
