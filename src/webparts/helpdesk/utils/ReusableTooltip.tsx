import { useContext } from "react";
import { themeContext } from "../context/userThemeContext";
import styles from '../components/AllForm.module.scss';
import React from "react";
import { ITooltipHostStyles, IconButton, TooltipHost } from "office-ui-fabric-react";

/*          NOTES - [ANISH]
    - ThemedColor - light , dark , site  - Context API
    - content - Text [ Strings Inside Tooltip ]
    - lightdarkmode - Props -> Color Mode.
    - IconButton - It can be also Condtion Based - [ In Future. ] Based on Requirements.
*/
interface ReusableTooltipProps {
  content: string;
  lightdarkmode: string;
}
const ReusableTooltip: React.FC<ReusableTooltipProps> = ({
  content,
  lightdarkmode
}) => {
  let ThemedColor = useContext(themeContext)
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
  return (
    <TooltipHost content={content}
      styles={hostStyles}
      tooltipProps={{
        calloutProps: {
          styles: {
            calloutMain: {
              background: ThemedColor === 'dark' ? '#000' : '#fff'
            },
            // root: { border: '1px solid #333' }, // anish
            beak: { background: ThemedColor === 'dark' ? '#000' : '#fff' },
            beakCurtain: { background: ThemedColor === 'dark' ? '#000' : '#fff' },
          },
        },
        styles: {
          root: { background: ThemedColor === 'dark' ? '#000' : '#fff' },
          content: {
            background: ThemedColor === 'dark' ? '#000' : '#fff', padding: '0px 5px',
            color: ThemedColor === 'dark' ? '#fff' : '#000'
          },
        },
      }}
    >
      <IconButton
        id="field161"
        aria-describedby="field16"
        style={{ height: "30px", marginLeft: "0px", marginTop: "1px" }}
        className={styles.info}
        iconProps={{ iconName: "Info" }}
        styles={{ icon: { color: lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important', } }}
      >
      </IconButton>
    </TooltipHost>
  );
};

export default ReusableTooltip;
