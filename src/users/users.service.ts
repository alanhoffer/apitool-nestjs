import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>
    ){}
    
    // Function to get an (User) row finding in the db passing the id as conditional
    async getUser(id:number): Promise<User | undefined>{
        const foundedUser = await this.userRepository.findOne({where: {id}})

        // if user hasn't founded will return undefined
        if(!foundedUser){
            return undefined;
        }
        
        // else will return the user founded
        return foundedUser
    }


    async getUserByEmail(email:string): Promise<User | undefined>{
        const foundUser =  this.userRepository.findOne({where: {email}});

        if(!foundUser){
            return undefined;
        }

        return foundUser;
    }

  
    async createUser(user:createUserDto): Promise<User | undefined>{
        
        const foundUser = await this.userRepository.findOne({where: {email:user.email}})

        if(foundUser){
            return undefined;
        }

        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    async deleteUser(id:number){
        
        const foundUser = await this.userRepository.findOne({where: {id}})

        if(!foundUser){
            return undefined;
        }

        return this.userRepository.delete({id})
    }

    
}


