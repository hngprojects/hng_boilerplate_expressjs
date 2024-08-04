import { User } from "../models";
import { UserResponsePayload } from "../types";

const userLoginResponseDto = (user: User): UserResponsePayload => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.user_type,
    avatar_url: user.profile?.profile_pic_url,
    user_name: user.profile?.username,
  };
};

export { userLoginResponseDto };
