import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { getUsers } from "@/shared/services/user/service-user";
import { User } from "@/shared/model/user/User";

const FormItem = Form.Item;

interface Props {
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
}

export const AllUserSelect = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  const init = async () => {
    const users = await getUsers();
    if (users) {
      users.push({
        id: -1,
        fullName: "Sys",
        userName: "Sys",
        auditTs: new Date().toISOString().slice(0, 10),
        branchId: 0,
        contact: "",
        email: "",
        password: "",
        roleId: 0,
        status: true,
      });

      setUsers(users);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FormItem labelAlign="left" label={props.localize("User")}>
      <Select
        value={props.value || undefined}
        onChange={(val: any) => props.onChange(Number(val || 0))}
        showSearch
        optionFilterProp="children"
        allowClear={props.clearable}
      >
        {users.map((x) => (
          <Select.Option title={x.fullName} key={x.id} value={x.id}>
            {x.fullName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
