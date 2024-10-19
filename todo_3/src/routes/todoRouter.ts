import express from 'express';
const router = express.Router();
import axios from 'axios';
import todoData from './todoData';
import LibPg from '../lib/LibPg';

/**
* 
* @param
*
* @return
*/ 
router.post('/create', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const body = req.body;
    const query = `
    INSERT INTO public."Todo" (title, content, "userId", complete, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp)
    RETURNING id;
    `;
    const now = new Date();
    const values = [
    body.text,
    "",
    0,
    0,
    ];
    const client = LibPg.getClient();
    const result = await client.query(query, values);
    const resultRow = result.rows[0];
    client.end();
    console.log(resultRow);
    const insertedId = result.rows[0].id;
    console.log(`added with ID: ${insertedId}`);    
    retObj.ret = 200;
    retObj.data = resultRow;    
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/get_list', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  //
  try {
    const body = req.body;      
    console.log(body.userId);
    const text = `
      SELECT * FROM public."Todo"
       where "userId" = '0'
      ORDER BY id DESC
    `;
    const client = LibPg.getClient();
    const result = await client.query(text);
    client.end();
    console.log(result.rows);
    retObj.ret = 200;
    retObj.data = result.rows;
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/get', async function(req: any, res: any) {
  //
  try {
    console.log(req.body);
    const items = todoData.getItem(req.body);
console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/delete', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const body = req.body;
    const client = LibPg.getClient();
    const query = `
    DELETE FROM public."Todo"
    WHERE id = $1;
  `;
    const result = await client.query(query, [body.id]);
    client.end();
    retObj.ret = 200;
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/update', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
console.log(body);
//return res.json(retObj);
    /*
    const query = `
    INSERT INTO public."Todo" (title, content, "userId", complete, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp)
    RETURNING id;
    `;
    const now = new Date();
    const values = [
    body.text,
    "",
    0,
    0,
    ];
    */
    //
    const query = `
    UPDATE public."Todo"
    SET title = $1, "updatedAt" = current_timestamp
    WHERE id = $2;
   `;
    const values = [body.text, body.id];
    const client = LibPg.getClient();
    const result = await client.query(query, values);
    client.end();
    if (result.rowCount === 0) {
      console.log(`TODO with ID ${body.id} not found.`);
    } else {
      console.log(`TODO with ID ${body.id} updated successfully.`);
    }
    /*
    const query = `
    UPDATE todos
    SET title = $1, updated_at = $2
    WHERE id = $3;
  `;
    const values = [title, updatedAt, id];
    const result = await client.query(query, values);
    */

    retObj.ret = 200;
    retObj.data = body;    
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default router;
