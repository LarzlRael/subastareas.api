import { OneToOne, CreateDateColumn } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from 'src/offer/entities/offer.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  finalAmount: number;

  @Column()
  solvedHomeworkUrl: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToOne(() => Offer, { eager: true })
  /* @JoinColumn({ name: 'id_offer' }) */
  offer: Offer;
}
