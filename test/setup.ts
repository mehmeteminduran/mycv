import { rm } from "fs"
import { join } from "path"
import { DataSource } from "typeorm";

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'), () => { });
    } catch (error) {

    } 
});

global.afterEach(async () => {
    let dataSource = new DataSource({
        type: 'sqlite',
        database: 'test.sqlite'
    });

    let connection = await dataSource.manager.connection;
    if(connection.isInitialized){
        connection.destroy();
    }
   
});