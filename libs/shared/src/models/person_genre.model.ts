import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Genre } from "./genre.model";
import { Person } from "./person.model";
import { ApiProperty } from "@nestjs/swagger";

interface PersonGenreCreationAttrs {
  person_id: number,
  genre_id: number,
}

@Table({ tableName: "person_genre", createdAt: false, updatedAt: false })
export class PersonGenre extends Model<PersonGenre, PersonGenreCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный индефикатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ApiProperty({ example: "1", description: "внешний ключ, ссылается на PERSON" })
  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, unique: "uniqueTag", onDelete: "CASCADE", onUpdate: "CASCADE" })
  person_id: number;

  @BelongsTo(() => Person)
  person: Person;

  @ApiProperty({ example: "1", description: "внешний ключ, ссылается на GENRE" })
  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER, unique: "uniqueTag", onDelete: "CASCADE", onUpdate: "CASCADE" })
  genre_id: number;

  @BelongsTo(() => Genre)
  genre: Genre;

}