import React from "react";
import { Table } from "antd";
import { CustomerKymView } from "@/shared/model/customer/CustomerKymView";
import { CorporateProfile } from "@/shared/model/customer/CorporateProfile";
import { LocalizeFn } from "@/shared/context/LocaleContext";

const DetailTable = (props: {
  details: CustomerKymView;
  gender: string;
  personal?: any;
  corporate?: CorporateProfile;
  localize: LocalizeFn;
}) => {
  const dataSource: { key: string; title: string; value: any }[] = [];
  const columns = [
    {
      title: "",
      dataIndex: "title",
      key: "key",
      render: (val: any) => (
        <strong style={{ paddingBlock: "1rem" }}>{val}</strong>
      ),
    },
    { title: "", dataIndex: "value", key: "key" },
  ];
  const { localize } = props;
  const { gender, personal, details, corporate } = props;
  if (personal) {
    dataSource.push({ key: "1", title: localize("Gender"), value: gender });
    dataSource.push({
      key: "2",
      title: localize("DateOfBirth"),
      value: personal.dateOfBirthNp,
    });
  }

  if (details) {
    dataSource.push({
      key: "1",
      title: localize("PanNo"),
      value: details.panNumber,
    });
    dataSource.push({
      key: "2",
      title: localize("VATNo"),
      value: details.vatNumber,
    });
    dataSource.push({
      key: "3",
      title: localize("FatherName"),
      value: details.fatherName,
    });
    dataSource.push({
      key: "4",
      title: localize("FatherContact"),
      value: details.fatherContact,
    });
    dataSource.push({
      key: "5",
      title: localize("FatherMemberId"),
      value: details.fatherCustomerId,
    });
    dataSource.push({
      key: "6",
      title: localize("MotherName"),
      value: details.motherName,
    });
    dataSource.push({
      key: "7",
      title: localize("MotherContact"),
      value: details.motherContact,
    });
    dataSource.push({
      key: "8",
      title: localize("MotherMemberId"),
      value: details.motherCustomerId,
    });
    dataSource.push({
      key: "9",
      title: localize("SpouseName"),
      value: details.spouseName,
    });
    dataSource.push({
      key: "10",
      title: localize("SpouseContact"),
      value: details.spouseContact,
    });
    dataSource.push({
      key: "11",
      title: localize("SpouseMemberId"),
      value: details.spouseCustomerId,
    });
    dataSource.push({
      key: "12",
      title: localize("GrandFatherName"),
      value: details.grandFatherName,
    });
    dataSource.push({
      key: "13",
      title: localize("GrandFatherContact"),
      value: details.grandFatherContact,
    });
    dataSource.push({
      key: "14",
      title: localize("GrandFatherMemberId"),
      value: details.grandFatherCustomerId,
    });
    dataSource.push({
      key: "15",
      title: localize("CitizenshipNumber"),
      value: details.citizenshipNumber,
    });
    dataSource.push({
      key: "16",
      title: localize("CitizenshipIssuePlace"),
      value: details.citizenshipIssuePlace,
    });
    dataSource.push({
      key: "17",
      title: localize("CitizenshipIssuedDate"),
      value: details.citizenshipIssuedDate,
    });
    dataSource.push({
      key: "18",
      title: localize("DrivingLicenseNumber"),
      value: details.drivingLicenseNumber,
    });
    dataSource.push({
      key: "19",
      title: localize("DrivingLicenseIssuePlace"),
      value: details.drivingLicenseIssuePlace,
    });
    dataSource.push({
      key: "20",
      title: localize("PassportNumber"),
      value: details.passportNumber,
    });
    dataSource.push({
      key: "21",
      title: localize("LandLineNumber"),
      value: details.residenceContact,
    });
    dataSource.push({
      key: "22",
      title: localize("PassportIssuePlace"),
      value: details.passportIssuePlace,
    });
    dataSource.push({
      key: "23",
      title: localize("BenificiaryName"),
      value: details.benificiaryName,
    });
    dataSource.push({
      key: "24",
      title: localize("NomineeName"),
      value: details.nomineeName,
    });
    dataSource.push({
      key: "25",
      title: localize("Introducer"),
      value: details.introducer,
    });
  }

  if (corporate) {
    dataSource.push({
      key: "1",
      title: localize("OrgName"),
      value: corporate.orgName,
    }),
      dataSource.push({
        key: "2",
        title: localize("NickName"),
        value: corporate.nickName,
      }),
      dataSource.push({
        key: "3",
        title: localize("Address"),
        value: corporate.address,
      }),
      dataSource.push({
        key: "4",
        title: localize("Contact"),
        value: corporate.contact,
      }),
      dataSource.push({
        key: "7",
        title: localize("Email"),
        value: corporate.email,
      }),
      dataSource.push({
        key: "5",
        title: localize("PANNo"),
        value: corporate.panNumber,
      }),
      dataSource.push({
        key: "6",
        title: localize("PanType"),
        value: corporate.panType,
      }),
      dataSource.push({
        key: "8",
        title: localize("ContactPerson"),
        value: corporate.contactPerson,
      }),
      dataSource.push({
        key: "9",
        title: localize("RegdNumber"),
        value: corporate.registrationNumber,
      });
  }

  return (
    <Table
      size="small"
      dataSource={dataSource}
      showHeader={false}
      scroll={{ y: 600 }}
      columns={columns as any}
      pagination={false}
    />
  );
};

export { DetailTable };
