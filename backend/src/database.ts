const express = require('express');
const oracledb = require('oracledb');

const app = express();
const port = 3000;

let user = 'c##junta_vecinal';
const password = '123';
const connectString = 'localhost:1521/xe';

const id_comuna = 5;
const nombre = 'Estacion Central';
//arreglar
app.post('/comunas', async (req, res) => {
    let conn;
  
    try {
      const { id_comuna, nombre } = req.body; //Obtener los valores a insertar desde el body de la petición
      conn = await oracledb.getConnection({
        user,
        password,
        connectString
      });
  
      const result = await conn.execute(`INSERT INTO comuna (id_comuna, nombre) VALUES(:1, :2)`, [id_comuna, nombre]);
      await conn.commit(); //Confirmar la transacción
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  });

app.get('/municipalidad', async (req, res) => {
  let conn;

  try {
    conn = await oracledb.getConnection({
      user,
      password,
      connectString
    });

    const result = await conn.execute(`SELECT * FROM comuna`);

    const comunas = result.rows.map(comuna => ({
        id_comuna: comuna[0],
        nombre_comuna: comuna[1]
    }));
    res.json(comunas);
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

// import oracledb from 'oracledb';

// let user = 'c##junta_vecinal';
// const id = 4;
// const comuna = 'Maipu';
// const tabla = 'comuna';
// async function connect() {
  
//     await oracledb.initOracleClient();  
//   let conn;

//   try {
//     conn = await oracledb.getConnection({
//       user: user,
//       password: '123',
//       connectString: 'localhost:1521/xe'
//     });
//     // const result = await conn.execute(`UPDATE comuna SET nombre = '${comuna}' where id_comuna = ${id}`);
//     console.log('Usuario conectado éxitosamente: ' + user);
//     // const result = await conn.execute(`INSERT INTO comuna (id_comuna, nombre) VALUES(:1, :2)`, [id, comuna]);
//     // await conn.commit();
//     const result = await conn.execute(`INSERT INTO comuna (id_comuna, nombre) VALUES(${id}, ${comuna})`)
//     // const result = await conn.execute(`SELECT * FROM ${tabla}`);
//     // console.log(result);
//     console.log(JSON.stringify(result.rows));
//   } catch (err) {
//     console.error(err, 'error en la conexión');
//   } finally {
//     if (conn) {
//       await conn.close();
//       console.log('conexión cerrada');
//     }
//   }
// }

// connect();