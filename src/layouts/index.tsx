import { ProLayout } from "@ant-design/pro-layout";
import { Link, Outlet, useAppData, useLocation } from "umi";

export default function Layout() {
  const { clientRoutes } = useAppData();
  const location = useLocation();

  // 对登录界面使用不同的layout
  if (location.pathname === "/login") {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  return (
    <ProLayout
      route={clientRoutes[0]}
      location={location}
      title="智能问答机器人"
      breakpoint={false}
      defaultCollapsed
      contentStyle={{
        margin: 0,
        padding: 0,
      }}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            <Link to={menuItemProps.path} target={menuItemProps.target}>
              {defaultDom}
            </Link>
          );
        }
        return defaultDom;
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
