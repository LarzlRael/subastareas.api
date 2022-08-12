import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../auth/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Rol } from '../../roles/entities/rol.entity';

export class UserCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const user = await factory(User)().create();

    const wallet = await connection
      .createQueryBuilder()
      .insert()
      .into(Wallet)
      .values([{ user, balanceTotal: 0 }])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Rol)
      .values([
        {
          user,
          rolName: 'admin',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .update(User)
      .set({
        wallet: {
          id: wallet.identifiers[0].id,
        },
      })
      .where('id = :id', { id: user.id })
      .execute();
  }
}
