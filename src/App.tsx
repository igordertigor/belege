import { useForm } from '@mantine/form';
import { ActionIcon, Button, Divider, FileInput, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core';
import { createTheme, MantineProvider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { randomId, useDisclosure, useLocalStorage } from '@mantine/hooks';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'
import { Trash2 } from 'lucide-react';
import './App.css'
import AccountInput from './components/AccountInput';
import AccountsUpload from './components/AccountsUpload';
import { useEffect } from 'react';
import { Transaction } from './schema';
import { downloadTransaction } from './utils/downloadObject';

const theme = createTheme({});

function App() {

  const [username, setUsername] = useLocalStorage({
    key: 'username',
    defaultValue: '',
    getInitialValueInEffect: false, 
  });

  const [opened, { open, close }] = useDisclosure(false);

  const [accounts, setAccounts] = useLocalStorage({
    key: 'accounts',
    defaultValue: [],
    getInitialValueInEffect: false,
  })

  useEffect(() => {
    if (accounts.length == 0) {
      open();
    }
  }, [accounts])

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username,
      date: new Date(),
      splits: [{account: '', amount: 0, description: '', key: randomId()}]
    },
    validate: {
      username: (value) => value.length === 0 ? "Missing username" : null,
    }
  });

  const handleSubmit = form.onSubmit((values) => {
    form.validate();
    setUsername(values.username);
    const total = values.splits.reduce((sum, s) => sum + s.amount, 0);

    if (Math.abs(total) > 0.01) {
      console.error("Error unbalanced")
      form.setErrors({
        splits: 'Splits must sum to zero (currently: ' + total.toFixed(2) + ')',
      });
      return;
    }

    console.log('Valid transaction:', values);
    if (values.receipt !== undefined) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        try {
          const validated = Transaction.parse(
            {receipt: (fileReader.result as string), ...values}
          );
          downloadTransaction(validated);
          form.reset();
        } catch (e) {
          console.error("Error validating transaction", e);
        }
      });
      fileReader.readAsDataURL(values.receipt);
    } else {
      try {
        const validated = Transaction.parse(values);
        downloadTransaction(validated);
        form.reset();
      } catch (e) {
        console.error("Error validating transaction", e);
      }
    }
  })

  const splitsComponents = form.getValues().splits.map((split, idx) => (
    <>
      <Stack key={split.key} mt="xs">
        <TextInput
          placeholder="any description"
          style={{ flex: 1}}
          key={form.key(`splits.${idx}.description`)}
          {...form.getInputProps(`splits.${idx}.description`)}
        />
        <AccountInput
          placeholder="account"
          key={form.key(`splits.${idx}.account`)}
          {...form.getInputProps(`splits.${idx}.account`)}
        />
        <Group>
          <NumberInput
            decimalScale={2}
            key={form.key(`splits.${idx}.amount`)}
            {...form.getInputProps(`splits.${idx}.amount`)}
          />
          <ActionIcon key={`splits.${idx}.delete`} color="red" onClick={() => form.removeListItem('splits', idx)}>
            <Trash2 size={15} />
          </ActionIcon>
        </Group>
      </Stack>
      <Divider m={"md"}/>
    </>
  )
  )

  return (
    <MantineProvider theme={theme}>
      <form onSubmit={handleSubmit}>
        <TextInput
          withAsterisk
          label="Who are you?"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
        <DatePickerInput
          withAsterisk
          label="When did you make the transaction"
          key={form.key("date")}
          {...form.getInputProps("date")}
        />

        <Divider m={"md"} />

        {splitsComponents}

        <FileInput
          label="Photograph of receipt"
          accept='image/png,image/jpeg,application/pdf'
          key={form.key("receipt")}
          {...form.getInputProps("receipt")}
        />

        <Divider m={"md"}/>

        <Stack>
          <Button type='button' variant="outline" mt={"md"} onClick={() =>
            {
              const calculatedAmount = form.getValues().splits.reduce(
                    (sum, s) => (sum - (s.amount || 0.0)),
                    0.0)
              form.insertListItem(
                'splits',
                {
                  account: '',
                  amount: calculatedAmount,
                  description: '',
                  key: randomId()}
              );
            }
          }>
            Add transaction split
          </Button>

          <Button type="submit">Download formatted transaction</Button>

          <Button variant="subtle" onClick={open}>Upload account list</Button>
        </Stack>
      </form>

      <Modal
        opened={opened}
        onClose={close}
        title="Upload accounts"
        centered
      >
        <AccountsUpload onClose={close} />
      </Modal>
    </MantineProvider>
  )
}

export default App
