import { Injectable } from "@nestjs/common";
import { Users } from "@users/entity";
import exp from "constants";
import { Repository } from "typeorm";

@Injectable()
export class RedisUserRepository extends Repository<Users> {
    async findUserById(id: number): Promise<Users | undefined> {
        return await this.findOne({
          where: { id },

  
        });
    }
}