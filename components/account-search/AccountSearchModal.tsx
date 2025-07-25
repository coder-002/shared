import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { get, post } from "@/shared/services/ajaxService.ts";

import { useLocale } from "@/shared/context/LocaleContext.tsx";
import { useAuth } from "@/shared/context/AuthContext.tsx";
import { gutterSize } from "@/shared/constant/gutter.ts";
import { showErrorMessage } from "@/shared/helper/message-helper/messageHelper.ts";
import { Column } from "../common/crud/table.ts";
import { Group } from "@/shared/model/customer/Group.ts";
import { Gender } from "@/shared/model/customer/PersonalProfileInit.ts";
import { SearchResult } from "@/shared/model/search/Search.ts";
import { ProductSelect } from "../common/drop-down/ProductSelect.tsx";

interface Props {
  showSearch: boolean;
  onSelect: (item: SearchResult) => void;
  onClose: (show: boolean) => void;
  type: "deposit" | "loan" | "share";
}

export interface AccountSearchItem {
  id: number;
  createdOn: string;
  profileId: string;
  branch: string;
  accountNumber: string;
  shareAccount: string;
  product: string;
  productId: number;
  customerId: number;
  customerName: string;
  address: string;
  contact: string;
  collector: string;
  groups: string;
  genders: string;
}

const AccountSearchModal = (props: Props) => {
  const [show, setShow] = useState<boolean>(props.showSearch);
  const [account, setAccount] = useState<string>();
  const [customerName, setCustomerName] = useState<string>();
  const [contact, setContact] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [genderId, setGenderId] = useState<number>();
  const [groupId, setGroupId] = useState<number>();
  const [productId, setProductId] = useState<number>();
  const [profileId, setProfileId] = useState<number>();
  const [loading, setLoading] = useState<boolean>();
  const [shareAccount, setShareAccount] = useState<string>();
  const [data, setData] = useState<AccountSearchItem[]>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);

  const localize = useLocale();
  const userMeta = useAuth();
  const init = async () => {
    const res = await get<{ groups: Group[]; genders: Gender[] }>(
      "/member/personal/init"
    );
    if (res) {
      setGroups(res.data.groups);
      setGenders(res.data.genders);
    }
  };

  useEffect(() => {
    if (props.showSearch) {
      init();
    }
  }, [props.showSearch]);

  const handleSearch = async () => {
    setLoading(true);
    setData(undefined);
    try {
      const res = await post<any>(`/${props.type}/account-search`, {
        groupId: Number(groupId || 0),
        genderId: Number(genderId || 0),
        contact: contact || "",
        address: address || "",
        accountNumber: account || "",
        customerName: customerName || "",
        productId: Number(productId || 0),
        shareAccount: shareAccount || "",
        profileId: Number(profileId || 0),
      });

      if (res) {
        if (res.data?.length == 0) {
          showErrorMessage(localize("NoDataFound"));
        }
        setData(res.data);
        setLoading(false);
      }
    } catch (e) {
      showErrorMessage();
    }
  };

  const columns: Column<AccountSearchItem>[] = [
    { title: localize("CreatedOn"), dataIndex: "createdOn", key: "createdOn" },
    {
      title: localize("ProfileHash"),
      dataIndex: "profileId",
      key: "profileId",
      align: "right",
    },
    { title: localize("Branch"), dataIndex: "branch", key: "branch" },
    {
      title: localize("Account"),
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: localize("ShareAccount"),
      dataIndex: "shareAccount",
      key: "shareAccount",
    },
    { title: localize("Product"), dataIndex: "product", key: "product" },
    { title: localize("Name"), dataIndex: "customerName", key: "customerName" },
    { title: localize("Address"), dataIndex: "address", key: "address" },
    { title: localize("Contact"), dataIndex: "contact", key: "contact" },
    { title: localize("Collector"), dataIndex: "collector", key: "collector" },
    { title: localize("Group"), dataIndex: "groups", key: "groups" },
    { title: localize("Gender"), dataIndex: "genders", key: "genders" },
  ];

  return (
    <Modal
      okText={localize("Ok")}
      cancelText={localize("Cancel")}
      width="90vw"
      open={props.showSearch}
      onCancel={() => {
        setShow(false);
        props.onClose(show);
      }}
      footer={null}
    >
      <Form>
        <Row gutter={gutterSize}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item labelAlign="left" label={localize("Account")}>
              <Input
                value={account}
                onChange={(e: any) => setAccount(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item labelAlign="left" label={localize("MemberId")}>
              <InputNumber
                value={profileId}
                min={1}
                style={{ width: "100%" }}
                onChange={(profile: any) => setProfileId(profile ?? 0)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item labelAlign="left" label={localize("MemberName")}>
              <Input
                value={customerName}
                onChange={(e: any) => setCustomerName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item>
              <ProductSelect
                activeOnly={false}
                clearable
                localize={localize}
                type={props.type}
                value={productId}
                onChange={setProductId}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={5} lg={6}>
            <Form.Item labelAlign="left" label={localize("Address")}>
              <Input
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5} lg={6}>
            <Form.Item labelAlign="left" label={localize("Contact")}>
              <Input
                value={contact}
                onChange={(e: any) => setContact(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5} lg={6}>
            <Form.Item labelAlign="left" label={localize("Group")}>
              <Select
                style={{ width: "100%" }}
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => setGroupId(Number(value || 0))}
              >
                {groups?.map((x) => (
                  <Select.Option key={x.id} value={x.id}>
                    {x.groupName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4} lg={6}>
            <Form.Item labelAlign="left" label={localize("Gender")}>
              <Select
                style={{ width: "100%" }}
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => setGenderId(Number(value || 0))}
              >
                {genders?.map((x) => (
                  <Select.Option key={x.id} value={x.id}>
                    {x.genderName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={3} lg={2}>
            <Form.Item labelAlign="left" label=" ">
              <Button loading={loading} type="primary" onClick={handleSearch}>
                {localize("Search")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {data ? (
        <>
          <Divider />
          <Table
            scroll={{ x: 240 }}
            size="small"
            onRow={(record: any) => ({
              onClick: () => {
                const result: SearchResult = {
                  title: record.AccountNumber,
                  description: localize(
                    "_Branch_",
                    record.CustomerName,
                    record.Branch
                  ),
                  value: record.Id,
                  custom1: record.CustomerId,
                };
                props.onSelect(result);
                setShow(false);

                props.onClose(show);
              },
            })}
            dataSource={data}
            columns={columns as any}
          />
        </>
      ) : null}
    </Modal>
  );
};

export default AccountSearchModal;
