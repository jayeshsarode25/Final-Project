const { default: mongoose } = require('mongoose');
const productModel = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');
const { publishToQueue } = require('../broker/borker');

// ensure publishToQueue exists; in production this can be provided by a queue service
const publishToQueue = (typeof global.publishToQueue === 'function') ? global.publishToQueue : async () => {};

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        const seller = req.user.id; // Extract seller from authenticated user

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency,
        };

        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));


        const product = await productModel.create({ title, description, price, seller, images });

        // publish notifications (no-op in tests if publishToQueue isn't provided)
        await publishToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", product);
        await publishToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", {
            email: req.user?.email,
            productId: product._id,
            sellerId: seller
        });

        return res.status(201).json({
            message: 'Product created',
            data: product,
        });
    } catch (err) {
        console.error('Create product error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProducts(req, res) {
    const { q, skip = 0, limit = 10 } = req.query;

    // accept both camelCase and lowercase query param names
    const minPriceRaw = req.query.minprice ?? req.query.minPrice;
    const maxPriceRaw = req.query.maxprice ?? req.query.maxPrice;

    const filter = {};

    if (q) {
        filter.$text = { $search: q };
    }

    if (minPriceRaw !== undefined) {
        const min = Number(minPriceRaw);
        if (!Number.isNaN(min)) {
            filter['price.amount'] = { ...(filter['price.amount'] || {}), $gte: min };
        }
    }

    if (maxPriceRaw !== undefined) {
        const max = Number(maxPriceRaw);
        if (!Number.isNaN(max)) {
            filter['price.amount'] = { ...(filter['price.amount'] || {}), $lte: max };
        }
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20));

    return res.status(200).json({
        message: 'Products fetched successfully',
        data: products
    });
}

async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ data: product });
    } catch (err) {
        // handle invalid ObjectId (Mongoose CastError)
        if (err && err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        console.error('getProductById error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateProduct(req, res) {

    const { id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findOne({
        _id: id
    });

    if (!product){
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id){
        return res.status(403).json({ message: 'Forbidden: You can update only your own products' });
    }

    const allowedUpdates = [ 'title', 'description', 'price'];
    for (const key of Object.keys(req.body)){
        if (allowedUpdates.includes(key)){
            if (key === 'price' && typeof req.body.price === 'object'){
                if (req.body.price.amount !== undefined){
                    product.price.amount = Number(req.body.price.amount);
                }
                if (req.body.price.currency !== undefined){
                    product.price.currency = req.body.price.currency;
                }
            }else{
                product[key] = req.body[key];
            }
        }
    }
    await product.save();
    return res.status(200).json({ message: 'Product updated successfully', product});
}

async function deleteProduct(req, res) {

     const { id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ message: 'Invalid product id' });
    }

      const product = await productModel.findOne({
        _id: id
    });

    if (!product){
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id){
        return res.status(403).json({ message: 'Forbidden: You can update only your own products' });
    }

    await productModel.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: 'Product deleted successfully' });

}

async function getSellerProducts(req, res){

    const seller = req.user;

    const { skip = 0, limit = 10 } = req.query;

    const products = await productModel.find({ seller: seller.id }).skip(Number(skip)).limit(Math.min(Number(limit), 20));

    return res.status(200).json({
        data: products
    })

}



module.exports = {
	createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSellerProducts
};
