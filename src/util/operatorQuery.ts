import { Op } from 'sequelize';
// import sanitizeInput from './sanitizeInput';

/*
				if (params.employeeSkillExperienceYears !== undefined && params.employeeSkillExperienceYearsOperator !== undefined) {
					where.employeeId = 	{
						[Op.in]: Sequelize.literal(`(
								SELECT DISTINCT employee_skills.employee_id 
								FROM employee_skills 
								WHERE employee_skills.experience_years ${getOperatorQuery(params.employeeSkillExperienceYears, params.employeeSkillExperienceYearsOperator)}
						)`)
				};
				}
*/

/**
 * Generates a query object based on the operator and value provided
 * @param value - The value to be used in the query
 * @param operator - The operator to be used in the query ('GT', 'LT', 'EQ', 'NQ')
 * @returns A query object with the appropriate Sequelize operator
 */

const getOperatorQuery = (value: number, operator: string): any => {
  // switch (operator) {
  //   case 'GT': // Greater than
  //     return `> ${sanitizeInput(value, 'number')}`;
  //   case 'LT': // Less than
  // 		return `< ${sanitizeInput(value, 'number')}`;
  //   case 'EQ': // Equal to
  // 	  return `= ${sanitizeInput(value, 'number')}`;
  //   case 'NQ': // Not equal to
  // 	  return `<> ${sanitizeInput(value, 'number')}`;
  //   default:
  //     throw new Error(`Unknown operator: ${operator}`);
  // }
  switch (operator) {
    case 'GT': // Greater than
      return { [Op.gt]: value };
    case 'LT': // Less than
      return { [Op.lt]: value };
    case 'EQ': // Equal to
      return { [Op.eq]: value };
    case 'NQ': // Not equal to
      return { [Op.ne]: value };
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};

export default getOperatorQuery;
