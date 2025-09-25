import PropTypes from 'prop-types';
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function FormProvider({ children, onSubmit, methods }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);

  }
  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit}>{children}</form>
    </Form>
  );
}

FormProvider.propTypes = {
  children: PropTypes.node,
  methods: PropTypes.object,
  onSubmit: PropTypes.func,
};
