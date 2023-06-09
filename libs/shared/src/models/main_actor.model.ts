import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "./film.model";
import {Genre} from "./genre.model";
import {Person} from "./person.model";
import {ApiProperty} from "@nestjs/swagger";

interface MainActorCreationAttrs {
    film_id: number,
    person_id: number,
}

@Table({tableName: 'main_actor', createdAt: false, updatedAt: false})
export class MainActor extends Model<MainActor, MainActorCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный индефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: '1', description: 'внешний ключ,ссылается на  FILM' })
    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER, unique: 'uniqueTag', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    film_id: number;

    @BelongsTo(() => Film)
    film: Film;

    @ApiProperty({ example: '1', description: 'внешний ключ, ссылается на PERSON' })
    @ForeignKey(() => Person)
    @Column({type: DataType.INTEGER, unique: 'uniqueTag', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    person_id: number;

    @BelongsTo(() => Person)
    person: Person;

}