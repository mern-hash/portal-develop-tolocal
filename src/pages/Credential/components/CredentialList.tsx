import { FunctionComponent, ReactElement } from "react";

import {
  Heading,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "carbon-components-react";
import { format } from "date-fns";
import { ICredential, ICredentialField } from "@/shared/types";

const CredentialList: FunctionComponent<{
  credential: ICredential;
  fields: ICredentialField[];
  institution: {
    label: string;
    value: string;
  };
}> = ({ credential, fields, institution }): ReactElement => {
  const renderList = (data) => {
    const renderItem = (name, field, type) => ({
      label: name,
      value: type !== "timestamp" ? field : format(field, "MM/dd/yyyy"),
    });

    return (
      fields.map(({ name, field, type }) => {
        if (!field.includes("fields.")) {
          return renderItem(name, data?.[field], type);
        }

        return renderItem(
          name,
          // Custom fields are returned as e.g. fields.date, but we cannot access
          // the value just by data["fields.date"] so we need to split it into
          // data["fields"]["date"]
          data?.[field.split(".")[0]][field.split(".")[1]],
          type
        );
      }) || []
    );
  };

  return (
    <>
      <Heading className="credential__heading">Personal information</Heading>
      <StructuredListWrapper className="credential__wrapper">
        <StructuredListBody>
          {[...renderList(credential), institution].map((item, i) => (
            <StructuredListRow className="credential__table__row" key={i}>
              <StructuredListCell noWrap className="credential__table__key">
                <p>{item.label}</p>
              </StructuredListCell>
              <StructuredListCell className="credential__table__content">
                {item.label === "Photo" ? (
                  <a href={`${item.value}`}>{item.value}</a>
                ) : (
                  <p>{item.value || "-"}</p>
                )}
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </>
  );
};

export default CredentialList;
