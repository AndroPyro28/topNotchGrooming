const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
module.exports.addItem = async (req, res) => {
  try {
    if (
      req.body?.productImg?.length > 0 &&
      req.body?.productImg?.includes("image")
    ) {
      const cloudinaryUpload = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "topnotch_productImg",
        }
      );
      req.body.productImg = cloudinaryUpload.url;
      req.body.productImgId = cloudinaryUpload.public_id;
    }
    const product = new Product(req.body);

    const result = await product.insertProduct();

    if (result.insertId) {
      req.body.id = result.insertId;
      return res.status(200).json({
        msg: "Product added to the database",
        newProduct: req.body,
        success: true,
      });
    }

    return res.status(200).json({
      msg: "Product did not added to the database",
      success: false,
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    const product = new Product({});
    const allProducts = await product.getAllItems();
    return res.status(200).json({
      products: allProducts,
      success: true,
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = new Product({});

    const deleteResponse = await product.deleteItemById(id);

    if (deleteResponse.affectedRows) {
      return res.status(200).json({
        msg: "Product Deleted",
        success: true,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.updateItem = async (req, res) => {
  try {
    const { imageDisplay } = req.body;
    if (imageDisplay?.length > 0 && imageDisplay?.includes("image")) {
      const cloudinaryDelete = await cloudinary.uploader.destroy(
        req.body.item.product_image_id,
        {
          upload_preset: "topnotch_productImg",
        }
      );

      const cloudinaryUpload = await cloudinary.uploader.upload(imageDisplay, {
        upload_preset: "topnotch_productImg",
      });
      req.body.item.product_image_url = cloudinaryUpload.url;
      req.body.item.product_image_id = cloudinaryUpload.public_id;
    }
    const {
      id,
      product_name,
      product_stocks,
      product_price,
      product_category,
      product_description,
      product_age_limit,
      product_image_url,
      product_image_id,
      pet_type,
    } = req.body.item;
    const product = new Product({
      id : id,
      productName : product_name,
      productStocks : product_stocks,
      productPrice : product_price,
      productCategory : product_category,
      productDescription : product_description,
      productAgeGap : product_age_limit,
      productImg : product_image_url,
      productImgId : product_image_id,
      petType : pet_type,
    });

    const result = await product.updateItem();

    if(result.affectedRows > 0) {
      return res.status(200).json({
        msg: "Product updated",
        success: true
      })
    }

    return res.status(200).json({
      msg: "Product updated failed",
      success: false
    })
  } catch (error) {
    console.error("error", error.message);
  }
};

module.exports.searchItems = async (req, res) => {
  const {petCategory, ageLimit, itemCategory, itemName} = req.body;

  try {
    const product = new Product({});

    const products = await product.searchItems(itemName, petCategory, itemCategory, ageLimit)

    return res.status(200).json({
      products,
      success: true
    });
    
  } catch (error) {
    console.error(error.message);
  }
}