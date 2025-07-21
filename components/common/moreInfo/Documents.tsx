import React, { useState } from "react";
import { Card, Col, Modal, Row } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { gutterSize } from "@/shared/constant/gutter";
import { Attachment } from "@/shared/model/attachment/Attachment";

const Documents = (props: {
  data: Attachment[];
  imgUrl?: string;
  localize: LocalizeFn;
}) => {
  const [state, setState] = useState<{
    fullscreenImg?: string;
    pdfUrl?: string;
  }>({});

  const getImageUrl = (url: string) => {
    if (url.includes("/") || url.includes("\\")) return url;
    if (props.imgUrl != undefined) return `${props.imgUrl}/${url}`;
    else return `/Resources/Images/${url}`;
  };

  const { data } = props;
  return data && data.length ? (
    <Row gutter={gutterSize}>
      {data
        .filter(
          (x) =>
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "jpg" ||
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "jpeg" ||
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "png" ||
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "gif"
        )
        .sort((x, y) => {
          return x.expired === y.expired ? 0 : x ? -1 : 1;
        })
        .map((x: any) => (
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              className="full-width"
              style={{ border: x.Expired ? "2px solid red" : undefined }}
              cover={
                <img
                  onClick={() => setState({ fullscreenImg: x.fileName })}
                  src={getImageUrl(x.fileName)}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginRight: "16px",
                  }}
                />
              }
            >
              <Card.Meta
                description={x.originalFilename}
                title={x.description}
              />
            </Card>
          </Col>
        ))}
      {data
        .filter(
          (x) =>
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "pdf"
        )
        .sort((x, y) => {
          return x.expired === y.expired ? 0 : x ? -1 : 1;
        })
        .map((x: any) => (
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              style={{ border: x.expired ? "2px solid red" : undefined }}
              className="full-width"
              onClick={() =>
                setState({
                  ...state,
                  pdfUrl: `${
                    getImageUrl(x.fileName).includes(".pdf")
                      ? getImageUrl(x.fileName)
                      : `${getImageUrl(x.fileName)}.pdf`
                  }`,
                })
              }
              cover={
                <iframe
                  src={`${
                    getImageUrl(x.fileName).includes(".pdf")
                      ? getImageUrl(x.fileName)
                      : `${getImageUrl(x.fileName)}.pdf`
                  }`}
                />
              }
            >
              <Card.Meta
                description={x.originalFilename}
                title={x.description}
              />
            </Card>
          </Col>
        ))}
      {data
        .filter(
          (x) =>
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "xls" ||
            x.fileName.split(".")[x.fileName.split(".").length - 1] == "xlsx"
        )
        .sort((x, y) => {
          return x.expired === y.expired ? 0 : x ? -1 : 1;
        })
        .map((x: any) => (
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              style={{ border: x.expired ? "2px solid red" : undefined }}
              className="full-width"
              onClick={() =>
                window.open(
                  `${
                    getImageUrl(x.fileName).includes(".xls") ||
                    getImageUrl(x.fileName).includes(".xlsx")
                      ? getImageUrl(x.fileName)
                      : `${getImageUrl(x.fileName)}.${
                          x.fileName.split(".")[
                            x.fileName.split(".").length - 1
                          ]
                        }`
                  }`
                )
              }
            >
              <Card.Meta
                description={x.originalFilename}
                title={x.description}
              />
            </Card>
          </Col>
        ))}
      <Modal
        okText={props.localize("Ok")}
        cancelText={props.localize("Cancel")}
        width="95vw"
        open={state.fullscreenImg !== undefined}
        closable
        onCancel={() => setState({ ...state, fullscreenImg: undefined })}
        footer={null}
      >
        <Card
          cover={<img src={getImageUrl(state.fullscreenImg || "")} />}
        ></Card>
      </Modal>
      <Modal
        okText={props.localize("Ok")}
        cancelText={props.localize("Cancel")}
        width="90vw"
        bodyStyle={{ height: "800px" }}
        open={state.pdfUrl !== undefined}
        onCancel={() => setState({ ...state, pdfUrl: undefined })}
        footer={null}
      >
        <Card
          className="full-width"
          hoverable
          cover={<iframe height="700px" src={state.pdfUrl} />}
        />
      </Modal>
    </Row>
  ) : (
    <p>{props.localize("NoDocumentsFoundForMember")}</p>
  );
};

export { Documents };
