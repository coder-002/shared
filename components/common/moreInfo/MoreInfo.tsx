import { ReactNode, useEffect, useState } from "react";
import { Attachment } from "@/shared/model/attachment/Attachment.ts";
import { GuaranteeView } from "@/shared/model/loan/GuaranteeView.ts";
import { get } from "@/shared/services/ajaxService.ts";
import {
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  Image,
  List,
  message,
  Row,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import "./moreInfo.css";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { showLoadingMessage } from "@/shared/helper/message-helper/messageHelper.ts";
import { InfoCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import { gutterSize } from "@/shared/constant/gutter.ts";
import { GuaranteeInfo } from "./Guarantee.tsx";
import {
  CustomerInfoDepAccount,
  CustomerInfoLoanAccount,
} from "@/shared/model/customer/Customer.ts";
import { TerminatedAccount } from "@/shared/model/deposit/TerminatedAccount.ts";
import { DetailTable } from "./DetailTable.tsx";
import Loader from "../../Loader/Loader.tsx";
import { CorporateProfile } from "@/shared/model/customer/CorporateProfile.ts";
import { CustomerKymView } from "@/shared/model/customer/CustomerKymView.ts";
import { DepositAccounts } from "./DepositAccounts.tsx";
import { LoanAccounts } from "./LoanAccounts.tsx";
import { accountInfoPrint } from "./PrintInfo.ts";
import { ShareAccounts } from "./ShareAccounts.tsx";
import { Documents } from "./Documents.tsx";

// import { TerminatedAccount } from '@/shared/models/deposit/TerminatedAccount';

interface Props {
  customerId: number;
  show: boolean;
  onClose: () => void;
  localize: LocalizeFn;
}

export interface Model {
  corporate?: CorporateProfile;
  accounts: {
    deposit: CustomerInfoDepAccount[];
    loan: CustomerInfoLoanAccount[];
    share: CustomerInfoDepAccount[];
  };
  attachments: Attachment[];
  kymDetail: CustomerKymView;
  branch: string;
  branchId: number;
  contactNumber: string;
  customerName: string;
  customerType: string;
  email: string;
  gender?: string;
  genderId?: number;
  groupId: number;
  groupName: string;
  guarantee: GuaranteeView[];
  id: number;
  introducedOn: Date;
  introducedOnNp: string;
  permanentAddress: string;
  profileId: number;
  selfGuarantee: GuaranteeView[];
  temporaryAddress: string;
  photoUrl?: string;
  collectorId: number;
}

export interface AccountModel {
  deposit: CustomerInfoDepAccount[];
  loan: CustomerInfoLoanAccount[];
  share: CustomerInfoDepAccount[];
}

export interface NonMemberGurantee {
  name: string;
  accountNumber?: string;
  contactNumber: string;
  address: string;
  relation: string;
  citizenshipNumber: string;
  loanId: number;
}

export interface GuaranteeModel {
  selfGuarantee: GuaranteeView[];
  nonMemberGurantee: NonMemberGurantee[];
  guarantee: GuaranteeView[];
}

const MoreInfo = (props: Props) => {
  const [state, setState] = useState<{
    loading?: boolean;
    data?: Model;
    attachmentData?: Attachment[];
    guaranteeData?: GuaranteeModel;
    imgUrl?: string;
    activeTab?: number;
  }>({});

  const [depositAc, setDepositAc] = useState<CustomerInfoDepAccount[]>();
  const [loanAc, setLoanAc] = useState<CustomerInfoLoanAccount[]>();
  const [shareAc, setShareAc] = useState<CustomerInfoDepAccount[]>();
  const [lnLoading, setLnLoading] = useState<boolean>(false);
  const [depLoading, setDepLoading] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [depTerminate, setDepTerminate] = useState<TerminatedAccount[]>([]);
  const [loanTerminate, setLoanTerminate] = useState<TerminatedAccount[]>([]);
  const [shareTerminate, setShareTerminate] = useState<TerminatedAccount[]>([]);

  const { localize } = props;

  const init = async () => {
    if (!Number(props.customerId || 0) || !props.show) return;

    setState({
      ...state,
      loading: true,
      data: undefined,
      attachmentData: undefined,
      guaranteeData: undefined,
    });
    const [res, imgUrl] = await Promise.all([
      get<Model>(`member/get-info/${props.customerId}`),
      get<string>("/attachment/parameter"),
    ]);
    if (res && (res.data.kymDetail || res.data.corporate) && imgUrl) {
      setState({
        ...state,
        loading: false,
        data: res.data,
        imgUrl: imgUrl.data,
      });
    }
  };

  useEffect(() => {
    init();
  }, [props.show]);

  const { data, attachmentData, guaranteeData, imgUrl } = state;

  const listItem = (title: string, description: any) => {
    return (
      <List.Item>
        <List.Item.Meta title={title} description={description} />
      </List.Item>
    );
  };

  const getHtml = async () => {
    const head = `<head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
        <link href="/scripts/semantic-ui/semantic.css" rel="stylesheet" />
        <link href="/Content/font-awesome.min.css" rel="stylesheet" />
        </head>`;
    const css = `
            <style>
                body {padding: 1em;background: #fff;width: 100%;overflow: auto;}
                table {width: 100%;}
                table thead tr th {border-bottom: 1px solid #353434;}
                table tr td, table tr th {padding: 3px 5px; border-right: 1px solid #dadada;}
                thead {display: table-header-group; }
                tfoot { display: table-row-group; }
                tr {page-break-inside: avoid;font-size: 9pt;}
                .report-header h5 {margin: 0;padding: 0;font-weight: 200;}
                .center.aligned {text-align: center;}
                h1,h2,h3 {color: #3a275f;font-weight: 300;}
                h3.report-title {padding-bottom: 1em !important;margin: 0;}
                tbody tr td {padding: 0.3em 0.8em !important;}
                .info.grid span {float: right;}
                .info.grid strong {font-size: 10pt;}
                .info.grid .column {padding: 0.2em 1em !important;border-bottom: 1px solid #ccc;}
                .px2 {margin: 0 2em !important;}
                .hidden {display: none !important;}
                thead th .buttons {position: absolute;}
            </style>
        `;

    let rptHtml = `${head}${css}<body>`;

    const res = await get<AccountModel>(`/member/get-info/${props.customerId}`);
    if (res) {
      rptHtml += accountInfoPrint({
        loan: res.data.loan || [],
        deposit: res.data.deposit || [],
        share: res.data.share || [],
      });
    }

    rptHtml += `</body>`;
    rptHtml += `</>`;
    return rptHtml;
  };

  const printReport = async () => {
    showLoadingMessage();
    const pri = (document.getElementById("ifmcontentstoprint") as any)
      .contentWindow;
    pri.document.open();
    const content = await getHtml();

    pri.document.write(content);
    pri.document.close();
    pri.focus();

    setTimeout(() => {
      pri.print();
      message.destroy();
    }, 1000);
  };

  const handleChange = async (e: any) => {
    if (e == "moreInfo-1") {
      setState({ ...state, activeTab: 1 });
    }

    if (e == "moreInfo-2") {
      setState({ ...state, activeTab: 2 });

      if (!depositAc) {
        setDepLoading(true);
        const res = await get<AccountModel>(
          `/member/get-account-info-detail/deposit/${props.customerId}`
        );
        if (res) {
          setDepositAc(res.data.deposit);
        }
        setDepLoading(false);
      }
    }
    if (e == "moreInfo-4") {
      let attachmentData = state.attachmentData;
      if (!state.attachmentData) {
        const res = await get<Attachment[]>(
          `/member/get-attachment-info/${props.customerId}`
        );
        if (res) {
          attachmentData = res.data;
        }
      }
      setState({ ...state, attachmentData, activeTab: 4 });
    }
    if (e == "moreInfo-5") {
      let guaranteeData = state.guaranteeData;

      if (!state.guaranteeData) {
        const res = await get<GuaranteeModel>(
          `/member/get-guarantee-info/${props.customerId}`
        );
        if (res) {
          guaranteeData = res.data;
        }
      }
      setState({ ...state, guaranteeData, activeTab: 5 });
    }
  };

  const { Title } = Typography;
  return (
    <Drawer
      open={props.show}
      width="80vw"
      footer={false}
      onClose={() => {
        setState({
          ...state,
          attachmentData: undefined,
          guaranteeData: undefined,
          data: undefined,
        });
        setDepositAc(undefined);
        setLoanAc(undefined);
        setShareAc(undefined);
        props.onClose();
      }}
    >
      {data ? (
        <Tabs
          defaultActiveKey="moreInfo-1"
          // tabBarExtraContent={
          // 	state.activeTab == 2 ? (
          // 		<Tooltip title={localize("Print")}>
          // 			<Button
          // 				icon={<PrinterOutlined />}
          // 				onClick={async () => printReport()}
          // 				style={{ marginRight: "5em" }}
          // 			></Button>
          // 		</Tooltip>
          // 	) : null
          // }
          onChange={handleChange}
        >
          <Tabs.TabPane key="moreInfo-1" tab={localize("Member")}>
            <Row gutter={gutterSize}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card hoverable className="horizontal-card">
                  <div style={{ display: "flex" }}>
                    <Image
                      alt="example"
                      src={
                        data.photoUrl && imgUrl != undefined
                          ? `${imgUrl}/${data.photoUrl}`
                          : `/customer/image/${props.customerId}`
                      }
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginRight: "16px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Card.Meta
                        title={data.customerName}
                        description={data.permanentAddress}
                      />
                    </div>
                  </div>
                </Card>

                <List itemLayout="horizontal" size="small">
                  {listItem(localize("ProfileHash"), data.profileId)}
                  {listItem(localize("Branch"), data.branch)}
                  {listItem(localize("Group"), data.groupName)}
                  {listItem(localize("MemberName"), data.customerName)}
                  {listItem(
                    localize("PermanentAddress"),
                    data.permanentAddress
                  )}
                  {listItem(localize("TempAddress"), data.temporaryAddress)}
                  {listItem(localize("Contact"), data.contactNumber)}
                  {data.email ? listItem(localize("Email"), data.email) : null}
                  {listItem(localize("MemberSince"), data.introducedOnNp)}
                </List>
              </Col>
              <Col xs={24} sm={24} md={12}>
                {/* <Title level={4}>{localize(`${data.CustomerType}`)} {localize("Detail")}</Title> */}
                <DetailTable
                  gender={data.gender || ""}
                  personal={
                    data.customerType !== "Corporate"
                      ? data.kymDetail
                      : undefined
                  }
                  corporate={
                    data.customerType === "Corporate"
                      ? data.corporate
                      : undefined
                  }
                  details={data.kymDetail}
                  localize={localize}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key="moreInfo-2" tab={localize("Account")}>
            <Tooltip title={localize("Print")}>
              <Button
                icon={<PrinterOutlined />}
                onClick={async () => printReport()}
                style={{ marginBottom: "1.5rem" }}
              ></Button>
            </Tooltip>
            <Collapse
              defaultActiveKey={"dep"}
              accordion
              //   style={{
              //     minWidth: "fit-content",
              //   }}
              onChange={async (key: any) => {
                if (key == "loan" && !loanAc) {
                  setLnLoading(true);
                  const res = await get<AccountModel>(
                    `/member/get-account-info-detail/loan/${props.customerId}`
                  );
                  if (res) {
                    setLoanAc(res.data.loan);
                  }
                  setLnLoading(false);
                }

                if (key == "share" && !shareAc) {
                  setShareLoading(true);
                  const res = await get<AccountModel>(
                    `/member/get-account-info-detail/share/${props.customerId}`
                  );
                  if (res) {
                    setShareAc(res.data.share);
                  }
                  setShareLoading(false);
                }
              }}
            >
              <Collapse.Panel key="dep" header={localize("DepositAccount")}>
                <DepositAccounts
                  loading={depLoading}
                  data={depositAc ? depositAc : []}
                  localize={localize}
                />
              </Collapse.Panel>
              <Collapse.Panel key="loan" header={localize("LoanAccount")}>
                <LoanAccounts
                  loading={lnLoading}
                  data={loanAc ? loanAc : []}
                  localize={localize}
                />
              </Collapse.Panel>
              <Collapse.Panel key="share" header={localize("ShareAccount")}>
                <ShareAccounts
                  loading={shareLoading}
                  data={shareAc ? shareAc : []}
                  localize={localize}
                />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
          <Tabs.TabPane key="moreInfo-4" tab={localize("Documents")}>
            {attachmentData != undefined ? (
              <Documents
                localize={localize}
                imgUrl={state.imgUrl}
                data={attachmentData ? attachmentData : []}
              />
            ) : (
              <Loader />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane key="moreInfo-5" tab={localize("Guarantee")}>
            {guaranteeData != undefined ? (
              <GuaranteeInfo
                localize={localize}
                custId={props.customerId}
                guarantee={
                  state.guaranteeData ? state.guaranteeData?.guarantee : []
                }
                selfGuarantee={
                  state.guaranteeData ? state.guaranteeData.selfGuarantee : []
                }
                nonMemberGuarantee={
                  state.guaranteeData
                    ? state.guaranteeData.nonMemberGurantee
                    : []
                }
              />
            ) : (
              <Loader />
            )}
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <Card style={{ width: "100%", height: "200px" }} loading />
      )}
      <iframe
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </Drawer>
  );
};

const MoreInfoHelp = (props: {
  onShow: () => void;
  title: string | ReactNode;
  localize: LocalizeFn;
}) => {
  return (
    <>
      <a style={{ float: "left" }} onClick={props.onShow}>
        <InfoCircleOutlined /> {props.title}
      </a>
    </>
  );
};

export { MoreInfo, MoreInfoHelp };
