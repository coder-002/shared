import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";

import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import {
  getDepositProducts,
  getLoanProducts,
  getShareProducts,
} from "@/shared/services/dropdownservice/dropdownService";

const FormItem = Form.Item;

interface Item {
  id: number;
  productName: string;
}

interface Props {
  label?: string;
  clearable?: boolean;
  activeOnly: boolean;
  type: "deposit" | "loan" | "share";
  onChange: (val: number, name?: string) => void;
  value?: number;
  localize: LocalizeFn;
}

export const ProductSelect = (props: Props) => {
  const [products, setProducts] = useState<Item[]>([]);

  const init = async () => {
    function setState(result: any[]) {
      const products: Item[] = [];
      result.forEach((x) =>
        products.push({ id: x.id, productName: x.productName })
      );

      setProducts(products);
    }

    if (props.type === "deposit") {
      const res = await getDepositProducts(props.activeOnly);
      if (res) setState(res);
    }

    if (props.type === "loan") {
      const res = await getLoanProducts(props.activeOnly);
      if (res) setState(res);
    }

    if (props.type === "share") {
      const res = await getShareProducts(props.activeOnly);
      if (res) setState(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FormItem
      labelAlign="left"
      label={props.label || props.localize("Product")}
    >
      <Select
        value={props.value || undefined}
        onChange={(val: any) => {
          const item = products.filter((x) => x.id == val)[0];
          props.onChange(Number(val || 0), item?.productName);
        }}
        showSearch
        optionFilterProp="children"
        allowClear={props.clearable}
      >
        {products.map((x) => (
          <Select.Option title={x.productName} key={x.id} value={x.id}>
            {x.productName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
