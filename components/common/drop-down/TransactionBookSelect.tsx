import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { Book } from "@/shared/model/transaction/Book";
import { getTranBooks } from "@/shared/services/dropdownservice/dropdownService";

const FormItem = Form.Item;

interface Props {
  label?: string;
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
}

export const BookSelect = (props: Props) => {
  const [book, setBook] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    const res = await getTranBooks();
    if (res) {
      setLoading(false);
      setBook(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FormItem label={props.label || props.localize("Book")}>
      <Select
        allowClear={props.clearable}
        showSearch
        value={props.value || undefined}
        optionFilterProp="children"
        onChange={(val: any) => props.onChange(Number(val || 0))}
        loading={loading}
      >
        {book.map((x: any) => (
          <Select.Option title={x.bookName} key={x.id} value={x.id}>
            {x.bookName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
