import { FormItem } from "carbon-components-react";

type Props = { label: string; description: string };

const FormLabel = ({ label, description }: Props) => {
  return (
    <FormItem className="file-input">
      <p className="cds--file--label">{label}</p>
      {true ? (
        <p className="file-input__description cds--label--description">
          {description}
        </p>
      ) : undefined}
    </FormItem>
  );
};

export default FormLabel;
