import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row } from "antd";
import Joi from "joi";
import React, { useEffect, useState } from "react";
import { handleChangeCommon, validate } from "../../../../lib/form";
import { get, store } from "../../../../services/dataServices";
import ButtonCustom from "../../../atom/button/button";
import Container from "../../../atom/container/container";
import Header from "../../../atom/heading/header";
import Input from "../../../atom/input/input";
import ColorForm from "../color/color";
import SizeForm from "../size/size";
import "./productForm.scss";

interface ProductForm {
  isSuuccess: () => void;
  back?: () => void;
}

const ProductForm: React.FC<ProductForm> = ({ isSuuccess, back }) => {
  type draweType = "colorForm" | "sizeForm" | "";
  const [errors, setErrors] = useState<any>({});
  const [brand, setBrand] = useState<any>([]);
  const [unit, setUnit] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<draweType>("");
  const [category, setCategory] = useState<any>([]);
  const [size, setSize] = useState<any>([]);
  const [color, setColor] = useState<any>([]);
  const createUrl = "store-product";
  const formObj = {
    product_name: "",
    brand_id: "",
    unit_id: "",
    category_id: "",
    size: "",
    color: "",
    purchase_price: "",
    selling_price: "",
    initial_stock: "",
    warrenty: "",
    guarantee: "",
    description: "",
    available_for_online: "",
  };
  const [data, setData] = useState<any>(formObj);

  const rules: any = {
    product_name: Joi.string().min(3).max(100).required().label("Product Name"),
    brand_id: Joi.string().required().label("Brand"),
    unit_id: Joi.string().required().label("Unit"),
    category_id: Joi.string().required().label("Category"),
    purchase_price: Joi.number().required().label("Purchase"),
    selling_price: Joi.number().required().label("Selling price"),
    initial_stock: Joi.number().required().label("Initial price"),
    id: Joi.optional(),
    available_for_online: Joi.optional(),
    color: Joi.optional(),
    description: Joi.optional(),
    guarantee: Joi.optional(),
    warrenty: Joi.optional(),
    size: Joi.optional(),
  };

  const fetchSelectData = async () => {
    let allBrand = await get("get-all-brand-select", false);
    let allUnit = await get("get-all-unit-select", false);
    let allCategory = await get("get-all-category-select", false);
    let allSizes = await get("get-all/size",false);
    let allColor = await get("get-all/color",false);
    setBrand(allBrand.data);
    setUnit(allUnit.data);
    setCategory(allCategory.data);
    setSize(allSizes.data);
    setColor(allColor.data);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errors = validate(data, rules);
    setErrors(errors ? errors : {});
    console.log(errors);
    if (errors) {
      return;
    }

    let response = await store(data, createUrl);
    if (response) {
      setData(formObj);
      isSuuccess();
    }
  };



  const showDrawer = (drawerContentType: draweType) => {
    setDrawerContent(drawerContentType)
    setOpen(true);

  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchSelectData();
  }, ["brand"]);

  const handleChange = (e: any) => {
    console.log(e.target.value);
    const hadleChangeData = handleChangeCommon(e, data, errors, rules);
    setErrors(hadleChangeData.error);
    setData(hadleChangeData.account);
  };

  const handleSizeFormSuccess = async () => {
    let allSizes = await get("get-all/size",false);
    setSize(allSizes.data);
    setOpen(false);
  }

  const handleColorFormSuccess = async () => {
    let allColor = await get("get-all/color",false);
    setColor(allColor.data);
    setOpen(false);
  }

  return (
    <>
      <div className="o-form">
        <Header Tag="h2" text="Product Create" />
        <form onSubmit={handleSubmit}>
          <Container margin="12">
            <Row gutter={[32, 16]}>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Product Name"
                  value={data.product_name}
                  onChange={handleChange}
                  name="product_name"
                  type="text"
                  error={errors.product_name}
                  placeHolder="Product Name"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Brand"
                  value={data.brand_id}
                  onChange={handleChange}
                  name="brand_id"
                  type="select"
                  error={errors.brand_id}
                  options={brand}
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Unit"
                  value={data.unit_id}
                  onChange={handleChange}
                  name="unit_id"
                  type="select"
                  error={errors.unit_id}
                  options={unit}
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Category"
                  value={data.category_id}
                  onChange={handleChange}
                  name="category_id"
                  type="select"
                  error={errors.category_id}
                  options={category}
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Row>
                  <Col span={20}>
                    <Input
                      label="Size"
                      value={data.size}
                      onChange={handleChange}
                      name="size"
                      type="select"
                      options={size}
                      error={errors.size}
                      defaultSelect={true}
                      placeHolder="Product Size"
                    /></Col>
                  <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      style={{ alignSelf: "center" }}
                      type="dashed"
                      icon={<PlusOutlined />}
                      shape="circle"
                      onClick={()=> { showDrawer('sizeForm')}}
                    /></Col>
                </Row>

              </Col>
              <Col className="gutter-row" span={6}>
                <Row>
                  <Col span={20}>
                    <Input
                      label="Color"
                      value={data.color}
                      onChange={handleChange}
                      name="color"
                      type="select"
                      options={color}
                      error={errors.color}
                      defaultSelect={true}
                      placeHolder="Product Color"
                    />
                  </Col>
                  <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      style={{ alignSelf: "center" }}
                      type="dashed"
                      icon={<PlusOutlined />}
                      shape="circle"
                      onClick={()=> { showDrawer('colorForm')}}
                    /></Col>
                </Row>
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Purchase Price"
                  value={data.purchase_price}
                  onChange={handleChange}
                  name="purchase_price"
                  type="number"
                  error={errors.purchase_price}
                  placeHolder="Purchase Price"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Selling Price"
                  value={data.selling_price}
                  onChange={handleChange}
                  name="selling_price"
                  type="number"
                  error={errors.selling_price}
                  placeHolder="Selling Price"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Initial Stock"
                  value={data.initial_stock}
                  onChange={handleChange}
                  name="initial_stock"
                  type="number"
                  error={errors.initial_stock}
                  placeHolder="Initial Stock"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Warrenty"
                  value={data.warrenty}
                  onChange={handleChange}
                  name="warrenty"
                  type="text"
                  error={errors.warrenty}
                  placeHolder="Warrenty"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Guarantee"
                  value={data.guarantee}
                  onChange={handleChange}
                  name="guarantee"
                  type="text"
                  error={errors.guarantee}
                  placeHolder="Guarantee"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Input
                  label="Description"
                  value={data.description}
                  onChange={handleChange}
                  name="description"
                  type="text"
                  error={errors.description}
                  placeHolder="Description"
                />
              </Col>
            </Row>
          </Container>
          <Container margin="24">
            <div className="o-form__button">
              <ButtonCustom label="Create" disabled={false} />
            </div>
          </Container>
        </form>
      </div>
      <Drawer title="Add Item" placement="right" onClose={onClose} visible={open}>
        {drawerContent === 'sizeForm' ? <SizeForm isSuuccess={handleSizeFormSuccess} /> : <ColorForm isSuuccess={handleColorFormSuccess} />}
      </Drawer>
    </>
  );
};

export default ProductForm;
