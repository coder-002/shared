import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AutoComplete,
  Input,
  Modal,
  Switch,
  Table,
  Tooltip,
} from "antd";

import { get } from "@/shared/services/ajaxService.ts";
import { debounce } from "lodash";
import { LocalizeFn, useLocale } from "@/shared/context/LocaleContext.tsx";
import Loader from "@/shared/components/Loader/Loader.tsx";
import { useAuth } from "@/shared/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  LoadingOutlined,
  ProfileFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { SpecialInstructionView } from "@/shared/model/customer/SpecialInstruction.ts";
import { ReportFrame } from "@/shared/components/common/ReportFrame.tsx";
import { formatDate } from "@/shared/helper/date-helper/date-service.ts";
import { ExpiredKycList } from "@/shared/model/customer/CustomerView.ts";
import AccountSearchModal from "./AccountSearchModal";
import {
  accountSearchInfoModel,
  depositAccountSearchDetail,
  SearchResult,
} from "@/shared/model/search/Search";
import {
  searchDeposit,
  searchFdDeposit,
  searchLoan,
  searchNonTermDeposit,
  searchOdLoan,
  searchShare,
} from "@/shared/services/customer/service-customer";
import { MoreInfo } from "../common/moreInfo/MoreInfo";

interface Props {
  id?: string;
  value?: number;
  inputVal?: string;
  type: "deposit" | "loan" | "share" | "odLoan" | "fd" | "nonTerm";
  activeOnly?: boolean;
  allBranches: boolean;
  onChange: (
    accId: number,
    accDetail: depositAccountSearchDetail | accountSearchInfoModel
  ) => void;
  onReset?: () => void;
  moreInfo?: boolean;
  placeholder?: string;
  hideMoreInfo: () => void;
  loading?: boolean;
  branchId: number;
  hideInstructions?: boolean;
  hideKym?: boolean;
  disabled?: boolean;
  hideDormant?: boolean;
  localize: LocalizeFn;
  acStatement?: boolean;
  customerId?: number;
  label?: string;
  help?: any;
  limitAcToCustId?: boolean;
  productId?: number;
  allowClear?: boolean;
  limitAcToCustIdHideSwitch?: boolean;
}

const AccountSearch = (props: Props) => {
  const [customerId, setCustomerId] = useState<number>();
  const [loading, setLoading] = useState<boolean>();
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [queryText, setQueryText] = useState<string>();
  const [instructions, setInstructions] = useState<SpecialInstructionView[]>(
    []
  );
  const navigate = useNavigate();

  const [list, setList] = useState<ExpiredKycList[]>();
  const [expired, setExpired] = useState<boolean>();
  const [dormant, setDormant] = useState<boolean>();
  const [showDormant, setShowDormant] = useState<boolean>();
  const [stopDormant, setStopDormant] = useState<boolean>();
  const [openDd, setOpenDd] = useState<boolean>();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [matured, setMatured] = useState<boolean>();
  const [limitAcToCustId, setLimitAcToCustId] = useState<boolean | undefined>(
    props.limitAcToCustId
  );
  const [reportUrl, setReportUrl] = useState<string>();
  const [monthStartDate, setMonthStartDate] = useState<string>();
  const [showStatement, setShowStatement] = useState<boolean>(false);

  useEffect(() => {
    setLimitAcToCustId(props.limitAcToCustId || false);
  }, [props.limitAcToCustId]);

  const searchDebounceHandler = useMemo(
    () => debounce((val: any) => search(val), 500),
    [props.activeOnly, props.allBranches, props.type, limitAcToCustId]
  );

  useEffect(() => {
    return () => searchDebounceHandler.cancel();
  }, [searchDebounceHandler]);

  const handleValueChange = async () => {
    if (!props.value) {
      setSearchResult([]);
      setCustomerId(undefined);
      setInstructions([]);
      setQueryText("");
    }

    if (props.value && props.value != 0) {
      // let url = "/deposit/account/get/";
      let url = "/dep-acc/";
      if (props.type === "loan" || props.type === "odLoan")
        url = "/loan-acc/investment/get/";
      //if (props.type === "share") url = "/share/account/get/";
      if (props.type === "share") url = "/share-account/";

      url += props.value;
      const res = await get<any>(url);
      if (res) {
        const { data } = res;
        const result: SearchResult = {
          title: data.accountNumber,
          description: `${data.accountName} | Branch: ${data.nickName}`,
          value: data.id,
          custom1: data.customerId,
          custom2: data.interestRate,
        };

        setSearchResult([result]);
        setCustomerId(data.customerId);
        setQueryText(data.accountNumber);
      }
    }
  };

  useEffect(() => {
    handleValueChange();
  }, [props.value, props.type]);

  useEffect(() => {
    if (reportUrl) {
      setLoading(true);
    }
  }, [reportUrl]);

  const localize = useLocale();
  const userMeta = useAuth();

  const search = async (val: string) => {
    let searchFn = searchDeposit;
    if (props.type === "fd") searchFn = searchFdDeposit;
    if (props.type === "nonTerm") searchFn = searchNonTermDeposit;
    if (props.type === "loan") searchFn = searchLoan;
    if (props.type === "odLoan") searchFn = searchOdLoan;
    if (props.type === "share") searchFn = searchShare;

    const res = await searchFn(
      val,
      props.activeOnly || false,
      props.allBranches,
      props.branchId,
      props.acStatement == undefined ? false : props.acStatement,
      limitAcToCustId && props.customerId !== undefined ? props.customerId : 0,
      props.productId || 0
    );
    if (res) {
      setSearchResult(res.results);
      setLoading(false);
    }
  };

  const onSearch = async (val: string) => {
    if (!val) {
      setQueryText(val);
      return;
    }

    setLoading(true);
    setQueryText(val);
    searchDebounceHandler(val);
  };

  const onSelected = async (item: SearchResult) => {
    const { type, hideInstructions, hideKym, hideDormant } = props;
    const custName = item.description.split("|")[0];
    if (item) {
      let typ = type;
      if (typ == "fd" || type == "nonTerm") typ = "deposit";

      if (type == "deposit") {
        const { data } = await get<depositAccountSearchDetail>(
          `/dep-acc/search-info/${item.value}`
        );
        if (data) {
          if (!data.isTerminated) {
            if (!hideKym && data.kycPopup) {
              const res = await get<ExpiredKycList[]>(
                `/customer/get-kyc-status/${Number(item.custom1 || 0)}`
              );
              if (res) {
                setExpired(res.data.length > 0);
                setList(res.data);
              }
            }

            if (data.maturityPopup && data.isMatured) setMatured(true);
          }

          setDormant(data.isDormant);
          setShowDormant(data.showDormantPopUp);
          setStopDormant(data.stopDormantAc);
          setShowStatement(data.showStatement);

          props.onChange(
            Number(item.value || 0),
            //, {...item, custName: custName}
            data
          );
        }
      }

      if (type === "loan" || type === "share") {
        const endpoint =
          type === "loan"
            ? `/loan-acc/search-info/${item.value}`
            : `/${type}-account/search-info/${item.value}`;

        const info = await get<accountSearchInfoModel>(endpoint);

        if (info && info.data.isTerminated === false) {
          if (!hideKym && info.data.kycPopup) {
            const res = await get<ExpiredKycList[]>(
              `/customer/get-kyc-status/${Number(item.custom1 || 0)}`
            );
            if (res) {
              setExpired(res.data.length > 0);
              setList(res.data);
            }
          }

          if (info.data.maturityPopup && info.data.isMatured) {
            setMatured(true);
          }

          props.onChange(Number(item.value || 0), info.data);
        }
      }

      if (!hideInstructions) {
        const res = await get<SpecialInstructionView[]>(
          `/special-instruction/${
            props.type == "odLoan" || props.type == "loan"
              ? "loan"
              : props.type == "deposit" || props.type == "fd"
                ? "deposit"
                : "share"
          }/${item.value}`
        );
        if (res) {
          setCustomerId(Number(item.custom1 || 0));
          setQueryText(item.title);
          setInstructions(res.data || []);
        }
      } else {
        setCustomerId(Number(item.custom1 || 0));
        setQueryText(item.title);
        setInstructions([]);
      }
    }
  };

  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const options = searchResult.map((x) => {
    return {
      key: x.value,
      value: x.value?.toString(),
      label: (
        <div
          style={{
            borderBottom: "1px solid #aaa",
            paddingBottom: "0.75rem",
          }}
        >
          <span style={{ fontWeight: "bolder" }}>{x.title}</span>
          <br />
          {props.type == "deposit" ? (
            <>
              <small style={{ fontWeight: "bold" }}>
                {localize("ProfileHash")}
                {x.profileId}{" "}
                {x.childProfileId
                  ? `${localize("ChildProfileHash")}  ${x.childProfileId}`
                  : undefined}
              </small>
              <br />
            </>
          ) : null}
          {props.type == "loan" ||
          props.type == "share" ||
          props.type == "odLoan" ? (
            <>
              <small>
                {localize("ProfileHash")}
                {x.profileId}
              </small>
              <br />
            </>
          ) : null}
          <small>{x.description}</small>
          <br />
        </div>
      ),
    };
  });

  return (
    <React.Fragment>
      {/* <div style={{ marginTop: props.limitAcToCustId ? "-1.3em" : undefined }}> */}

      {props.limitAcToCustId && props.limitAcToCustIdHideSwitch != true ? (
        <div style={{}} className="ant-col ant-form-item-label">
          <label>{localize(props.label as any)} </label>
          <Tooltip title={localize("MemberDepostOnly")}>
            <Switch
              size="small"
              checked={limitAcToCustId}
              onChange={setLimitAcToCustId}
              style={{ marginLeft: "5px" }}
            />
          </Tooltip>
        </div>
      ) : null}

      <AutoComplete
        autoFocus={false}
        id={props.id}
        placeholder={props.placeholder}
        onSearch={onSearch}
        popupMatchSelectWidth={true}
        options={[...options]}
        style={{ width: "100%" }}
        value={queryText}
        disabled={props.disabled}
        open={openDd}
        onChange={() => setOpenDd(true)}
        onSelect={(val: any) => {
          const item = searchResult.filter(
            (x) => Number(x.value || 0) === Number(val || 0)
          )[0];
          onSelected(item);
          setOpenDd(false);
        }}
        onBlur={(val: any) => {
          if (!val) {
            setCustomerId(undefined);
            setQueryText("");
            setInstructions([]);
            props.onReset && props.onReset();
          }
          if (props.inputVal && !props.inputVal) {
            setCustomerId(undefined);
            setQueryText("");
            setInstructions([]);
          }
          setOpenDd(false);
        }}
        onFocus={() => {
          if (props.inputVal || queryText) {
            setQueryText(props.inputVal || queryText);
            searchDebounceHandler(props.inputVal || "");
            setOpenDd(true);
          }
        }}
      >
        <Input
          style={{ width: "100%", padding: "4px 11px", background: "inherit" }}
          onKeyUp={(e: any) => {
            if ((e.metaKey || e.ctrlKey) && e.keyCode == 113) {
              setShowSearch(true);
              setOpenDd(false);
            }
          }}
          value={queryText || props.inputVal}
          suffix={
            queryText?.trim() === "" ||
            customerId === undefined ||
            customerId === null ||
            customerId === 0 ? (
              <Tooltip title={localize("Search")}>
                <span
                  onClick={() => {
                    setShowSearch(true);
                    setOpenDd(false);
                  }}
                  className="certain-category-icon"
                >
                  {loading || props.loading ? (
                    <LoadingOutlined />
                  ) : (
                    <SearchOutlined />
                  )}
                </span>{" "}
              </Tooltip>
            ) : (
              <Tooltip title={localize("MoreInfo")}>
                <span
                  onClick={() => {
                    setShowMoreInfo(true);
                  }}
                  className="certain-category-icon"
                >
                  {loading || props.loading ? (
                    <LoadingOutlined />
                  ) : (
                    <InfoCircleOutlined />
                  )}
                </span>{" "}
              </Tooltip>
            )
          }
          prefix={
            props.value && showStatement ? (
              <Tooltip title={localize("Statement")}>
                <ProfileFilled
                  onClick={async () => {
                    const res = await get<string>(
                      "/core-parameter/show-date-in-account-statement"
                    );
                    if (res.data) {
                      if (res.data != null) {
                        const today = userMeta.today;
                        const stDate = today.toString();
                        const newDate = new Date(stDate);
                        const date = new Date(
                          newDate.setDate(newDate.getDate() - Number(res.data))
                        );
                        const monthDate = date,
                          mnth = date.getMonth() + 1,
                          day = date.getDate();
                        const finalDate = [
                          monthDate.getFullYear(),
                          mnth,
                          day,
                        ].join("-");
                        setMonthStartDate(finalDate);
                      } else
                        setMonthStartDate(
                          formatDate(new Date(userMeta.monthStart))
                        );
                    }
                    let type = props.type;
                    if (type == "fd") type = "deposit";
                    if (type == "odLoan") type = "loan";

                    setOpenDd(false);
                    setLoading(true);
                    setReportUrl(
                      `/rdlc/${type}-acc-statement-old?AccountId=${
                        props.value
                      }&FromDate=${formatDate(
                        new Date(monthStartDate || "")
                      )}&ToDate=${formatDate(new Date(userMeta.today))}`
                    );
                  }}
                  className="certain-category-icon"
                />{" "}
              </Tooltip>
            ) : null
          }
        />
      </AutoComplete>
      {props.help ? <div style={{}}>{props.help}</div> : null}

      <MoreInfo
        customerId={customerId || 0}
        show={showMoreInfo || (props.moreInfo ?? false)}
        onClose={() => {
          props.hideMoreInfo();
          setShowMoreInfo(false);
        }}
        localize={localize}
      />
      <Modal
        cancelText={localize("Cancel")}
        open={instructions.length > 0}
        okText={localize("Ok")}
        onCancel={() => setInstructions([])}
        title={localize("Instructions")}
        footer={null}
      >
        <div>
          {instructions.map((x) => (
            <Alert
              key={x.id}
              message={localize("MessageFrom_", x.creator)}
              description={x.message}
              style={{ margin: "5px 0" }}
              type={x.messageType as any}
              showIcon
            />
          ))}
        </div>
      </Modal>
      <Modal
        okText={localize("Ok")}
        cancelText={localize("Cancel")}
        open={dormant && showDormant}
        onCancel={() => setDormant(false)}
        footer={null}
      >
        <div>{localize("AccountIsDormant")}</div>
      </Modal>
      <Modal
        okText={localize("Ok")}
        cancelText={localize("Cancel")}
        open={matured}
        onCancel={() => setMatured(false)}
        footer={null}
      >
        <div>{localize("AccountIsMatured")}</div>
      </Modal>
      <AccountSearchModal
        onSelect={async (item: SearchResult) => {
          await onSelected(item);
          setSearchResult([item]);
          setOpenDd(false);
        }}
        type={
          props.type == "odLoan" || props.type == "loan"
            ? "loan"
            : props.type == "deposit" || props.type == "fd"
              ? "deposit"
              : "share"
        }
        showSearch={showSearch}
        onClose={(val: boolean) => {
          setShowSearch(val);
          setOpenDd(false);
        }}
      />

      <Modal
        okText={localize("Ok")}
        cancelText={localize("Cancel")}
        open={expired}
        footer={null}
        onCancel={() => setExpired(false)}
        title={localize("PendingKycUpdate")}
      >
        <br />
        <Table
          size="small"
          dataSource={list}
          onRow={(rec: any) => ({
            onClick: () => {
              navigate(`/frontdesk/profiles/personal/${rec.KycId}`);
            },
          })}
          columns={[
            { title: localize("Id"), dataIndex: "kycId", key: "kycId" },
            {
              title: localize("Name"),
              dataIndex: "customerName",
              key: "customerName",
            },
            {
              title: localize("LastVerifiedOn"),
              dataIndex: "lastVerifiedOn",
              key: "lastVerifiedOn",
            },
          ]}
          pagination={false}
        />
      </Modal>

      <Modal
        okText={localize("Ok")}
        width={"80%"}
        cancelText={localize("Cancel")}
        open={reportUrl != undefined}
        footer={null}
        onCancel={() => setReportUrl(undefined)}
      >
        {loading ? <Loader /> : null}
        <ReportFrame onLoaded={() => setLoading(false)} url={reportUrl || ""} />
      </Modal>
    </React.Fragment>
  );
};

export default AccountSearch;
