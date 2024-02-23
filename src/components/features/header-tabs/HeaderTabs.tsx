import { FunctionComponent } from "react";
import "./header-tabs.scss";
import { Tabs as CTabs, TabList, Tab } from "carbon-components-react";
import { IHeaderTab } from "@/shared/types";

const HeaderTabs: FunctionComponent<{
  tabs: IHeaderTab[];
  changeFn: (val: string) => void;
}> = ({ tabs, changeFn }) => {
  return (
    <CTabs
      onChange={(e: { selectedIndex: number; value: string }) =>
        changeFn(tabs[e.selectedIndex].value)
      }
    >
      <div className="header-tabs">
        <TabList
          className="header-tabs__tablist"
          aria-label="Tabs"
          activation="manual"
        >
          {tabs.map((tab: IHeaderTab, i: number) => (
            <Tab key={i} value={tab.value}>
              {tab.text}
            </Tab>
          ))}
        </TabList>
      </div>
    </CTabs>
  );
};

export default HeaderTabs;
