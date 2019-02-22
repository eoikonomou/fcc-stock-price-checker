var fetch = require('node-fetch');

function StockHandler() {

    this.fetchStock = async function (stock) {
        let url = "https://api.iextrading.com/1.0/stock/" + stock + "/quote";
        let response = await fetch(url);
        let data = await response.json();
        if (data) {
            return {
                stock: data.symbol,
                price: data.open
            }
        }
    };

    this.findLike = async function (stock, db, ip) {
        let response = await db.collection(ip).findOne({ name: stock });
        return response;

    }

    this.saveLike = async function (stock, db, ip) {
        let response = await db.collection(ip).insertOne({ name: stock });
        return response;
    }

    this.relLikes = function (obj1, obj2) {
        return obj1.likes - obj2.likes;
    }

    this.stockObj = async function stockObj(stock, db, ip) {
        let stkObj = await this.fetchStock(stock);
        if (stkObj) {
            let data = await this.findLike(stock, db, ip);
            if (data) {
                return {
                    stock: stkObj.stock,
                    price: stkObj.price,
                    likes: 1
                }
            } else {
                return {
                    stock: stkObj.stock,
                    price: stkObj.price,
                    likes: 0
                }
            }
        }
    }.bind(this)
}

module.exports = StockHandler;
