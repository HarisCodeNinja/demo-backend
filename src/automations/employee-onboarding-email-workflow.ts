import logger from '../util/logger';
import { Employee } from '../modules/employee/model';
import { sendEmail } from '../helper/email';
export const registerEmployeeOnboardingEmailWorkflow = (): void => {
  Employee.addHook('afterCreate', async (obj: Employee) => {
    const employees = obj.get({ plain: true });
    try {
      await sendEmail(`${employees.personalEmail}`, {
        subject: `Welcome to the organization`,
        html: `Hi ${employees.firstName} ${employees.lastName},

Welcome to the organisation. We are excited to have you onboard.

Thanks.

Regards,
HR, Organization`,
      });
    } catch (error) {
      logger.error({ error }, `'Employee Onboarding Email Workflow' has Error`);
    }
  });
};
