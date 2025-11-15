import FormContainer from "../../components/form-container/FormContainer";
import DynamicTable from "../../components/table/DynamicTable";
export default function SelectForm({
  row,
  schemas,
  data,
  schemaID,
  control,
  errorResult = {},
}) {
  const schema = schemas.find(
    (schema) => schema.dashboardFormSchemaID === schemaID
  );
  if (schema?.schemaType.startsWith("Table")) {
    return <DynamicTable key={schema.idField} schemas={schemas} data={data} />;
  } else if (schema.schemaType.startsWith("Form")) {
    return (
      <FormContainer
        tableSchema={schema}
        row={{}}
        errorResult={errorResult}
        control={control}
      />
    );
  }
}
