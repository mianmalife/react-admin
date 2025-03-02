import Icon from "@ant-design/icons"
import SvgModules from '@/assets/svg/index'

interface Props {
  className?: string;
  style?: React.CSSProperties;
  name: string
}

export default function SvgIcon(props: Props) {
  return SvgModules[props.name] ? <Icon {...props} component={SvgModules[props.name] as React.ForwardRefExoticComponent<any> } /> : null
}