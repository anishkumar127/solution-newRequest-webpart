import * as React from 'react';
import styles from './Helpdesk.module.scss';
import Home from './Home';
import { useStore } from '../store/zustand';
import AddNewWebPartInstallation from './tickets/AddNewWebPartInstallation/AddNewWebPartInstallation';
import Typed from '../TypeSafety/Types';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
const Helpdesk = () => {
  const fetchIsInstalled = useStore((state) => state.fetchIsInstalled);
  const isInstalledInfo = useStore((state) => state.getIsInstalled());
  const [isPresent, setIsPresent] = React.useState<boolean>(false);
  const [uiRender, setUIRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchedIsInstalled = async () => {
      await fetchIsInstalled();
    }
    fetchedIsInstalled();
  }, []);


  React.useEffect(() => {
    console.log("hey", isInstalledInfo);
    if (isInstalledInfo?.IsInstalled === Typed?.Yes) {
      console.log("Inside useEffect", isInstalledInfo);
      setIsPresent(true);
    } else {
      setIsPresent(false);
    }
  }, [isInstalledInfo?.IsInstalled, isPresent, uiRender]);

const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    console.log("reFetch", uiRender, "isPresent", isPresent);
  }, [uiRender, isPresent])
  return (
    <div className={styles.helpdeskMain}>
      {
        loading ? <Spinner size={SpinnerSize.large} /> :
        isPresent? <Home /> : <AddNewWebPartInstallation UIRender={{setLoading,loading, uiRender, setUIRender, isPresent, setIsPresent }} />
      }
    </div>
  )
}

export default Helpdesk