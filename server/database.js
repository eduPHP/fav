import mysql from 'mysql'
import config from './config.js'

class Database {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            ...config.database
        })
    }

    all(table) {
        return new Promise((resolve, reject) => {
            this.pool.query(`select * from ${table}`, (err, result) => {
                if(err) return reject(err)

                return resolve(result)
            })
        })
    }

    find(table, id) {
        return new Promise((resolve, reject) => {
            this.pool.query(`select * from ${table} where ?`, {id}, (err, result) => {
                if(err) return reject(err)
                if(result.length <= 0) {
                    return reject("not found")
                }

                return resolve(result[0])
            })
        })
    }

    insert(table, data) {
        return new Promise((resolve, reject) => {
            this.pool.query(`insert into ${table} SET ?`, data, (err, result) => {
                if(err) return reject(err)

                return resolve({...data, id: result.insertId})
            })
        })
    }

    update(table, id, data) {
        return new Promise((resolve, reject) => {
            this.pool.query(`update ${table} SET ? where id = ?`, [data, id], (err, result) => {
                if(err) return reject(err)
                if(result.affectedRows <= 0) return reject("not found")

                return resolve({...data, id, changed: result.changedRows > 0})
            })
        })
    }

    delete(table, id) {
        return new Promise((resolve, reject) => {
            this.pool.query(`delete from ${table} where id = ?`, [id], (err, result) => {
                if(err) return reject(err)
                if(result.affectedRows <= 0) return reject("not found")

                return resolve({deleted: true})
            })
        })
    }
}

export default new Database()