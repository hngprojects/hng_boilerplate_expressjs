import { User } from "../models";
import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";

const userRepository = AppDataSource.getRepository(User);
const isSuperAdmin = async (userId: string): Promise<boolean> => {
  const user = await userRepository.findOneBy({ id: userId });
  return user?.role === UserRole.SUPER_ADMIN;
};

export default isSuperAdmin;
