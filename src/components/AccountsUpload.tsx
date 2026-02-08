import { Button, FileInput, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks"

import { Accounts } from "../schema";


interface AccountsUploadProps {
  onClose: () => void;
}

const AccountsUpload = (props : AccountsUploadProps) => {
  const [accounts, setAccounts] = useLocalStorage({
    key: 'accounts',
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  const form = useForm({
    mode: "uncontrolled",
  });

  const handleSubmit = (values) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const rawContent = JSON.parse(reader.result);
      console.log(rawContent);
      const validatedContent = Accounts.parse(rawContent)
      setAccounts(validatedContent.names);
      props.onClose();
    })
    reader.readAsText(values.accountsFile);
  }

  return <Paper>
    <Stack>
      <Title order={3}>Current accounts</Title>
      <ScrollArea h={250}>
        {
          accounts.length
          ? accounts.map((name) => <Text key={name}>{name}</Text>)
          : <Text>No accounts uploaded</Text>
        }
      </ScrollArea>
      <Title order={3}>Upload account structure</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          accept="application/json"
          label="Upload accounts structure"
          {...form.getInputProps('accountsFile')}
        />
        <Button variant="outline" onClick={props.onClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </form>
    </Stack>
  </Paper>
}


export default AccountsUpload;
