import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const user: typeof usersTable.$inferInsert = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
    };

    await db.insert(usersTable).values(user);
    console.log('New user created!')

    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', users)
    /*
    const users: {
      id: number;
      name: string;
      age: number;
      email: string;
    }[]
    */

    const updatedUser = await db
        .update(usersTable)
        .set({
            age: 31,
        })
        .where(eq(usersTable.email, user.email)).returning();
    console.log('User info updated!', updatedUser)

    const deletedUser = await db.delete(usersTable).where(eq(usersTable.email, user.email)).returning();
    console.log('User deleted!', deletedUser)

    const newUsers = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', newUsers)
}

main();
