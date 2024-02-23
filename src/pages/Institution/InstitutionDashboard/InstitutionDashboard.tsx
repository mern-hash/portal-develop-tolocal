//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import "../institution.scss";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
//ANCHOR - Api
import { getInstitutionStatistics } from "@/api";
import { useQuery } from "@tanstack/react-query";
//ANCHOR - Carbon
import { Grid, Column } from "carbon-components-react";
import {
  Credentials,
  UserMultiple,
  IbmWatsonDiscovery,
} from "@carbon/icons-react";
//ANCHOR - Components
import { EmptyPage } from "@/components/features";
import { HeaderButton } from "@/components/ui";
//ANCHOR - Util
import { ContextTypes, ContextData } from "@/shared/types/ContextTypes";
import { Sponge } from "@/assets/icons";
import { calcRange } from "@/shared/dateFns";
import { pluralize } from "@/shared/util";
import {
  clearTabs,
  institutionDashboardHLC,
} from "@/shared/outlet-context/outletContext";
import { ADD_STUDENTS_DROPDOWN_TEXT } from "@/core/constants";
//!SECTION

const InstitutionDashboard: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState<
    | {
        from: Date;
        to: Date;
      }
    | undefined
  >();

  useEffect(() => {
    updateContext(
      ContextTypes.HLC,
      institutionDashboardHLC((val) => setDateFilter(calcRange(val)))
    );
    updateContext(ContextTypes.TABS, clearTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardData = [
    {
      id: "userCount",
      title: "Number of students",
      icon: <UserMultiple size="28px" />,
      text: "Registered student",
    },
    {
      id: "credentialCount",
      title: "Number of credentials issued",
      icon: <Credentials size="28px" />,
      text: "Issued credential",
    },
    {
      id: "verificationCount",
      title: "Number of verifications",
      icon: <IbmWatsonDiscovery size="28px" />,
      text: "Verified credential",
    },
  ];

  const { data, isLoading } = useQuery(
    [
      "institutionDashboard",
      {
        from: dateFilter?.from,
        to: dateFilter?.to,
      },
    ],
    getInstitutionStatistics,
    {
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Show empty state in two cases:
  // 1. data is not loaded;
  // 2. 'All time' date filter is selected and there are no statistics data for each segment in dashboard
  const isEmptyPage = () =>
    !data || (!dateFilter && dashboardData.every((item) => !data[item.id]));

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {!isLoading && isEmptyPage() ? (
        <EmptyPage
          icon={<Sponge />}
          heading="Start building your dashboard"
          desc="Before viewing the reports, you need to add students first."
          button={
            <HeaderButton
              id="add-student"
              buttonText={ADD_STUDENTS_DROPDOWN_TEXT}
              iconType="add"
              items={[
                {
                  text: "Manually",
                  onClick: () => navigate("students/create"),
                },
                {
                  text: "Bulk upload",
                  onClick: () => navigate("students/bulk"),
                },
              ]}
            />
          }
        />
      ) : (
        <Grid className="institution-dashboard">
          {!isLoading &&
            data &&
            dashboardData.map((item, key) => (
              <Column
                key={key}
                sm={4}
                md={4}
                lg={5}
                className="institution-dashboard__card"
              >
                <p className="institution-dashboard__card__title">
                  {item.title}
                </p>
                {item.icon}
                <p className="institution-dashboard__card__number">
                  {data[item.id]}
                </p>
                <span>{pluralize(data[item.id], item.text)}</span>
              </Column>
            ))}
        </Grid>
      )}
    </>
  );
};

export default InstitutionDashboard;
