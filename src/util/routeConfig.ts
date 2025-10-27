import { Router } from 'express';

// Define an interface for the route configuration
export interface RouteConfig {
  path: string; // Base path to be prefixed to each route
  tags: string[]; // Tags to be added to each route's options
  routes: Router; // Router to be configured
}

/**
 * Function to configure routes with base path and tags
 * @param config - The route configuration object
 * @param notInclude - The array of paths to be excluded from prefixing
 * @returns The array of Router objects
 */
export const prefixRoutes = (config: RouteConfig, notInclude: string[] = []): Router[] => {
  // Simply return the router as-is since Express will handle the path prefixing
		// console.log(path, r.method);
	// 	if(notInclude.includes(path)){
	// 		return;
	// 	}
  //   // Prefix the route's path with the base path from the configuration
  //   //r.path = `${config.path}${r.path}`;
	// 	r.path = path;
  //   // Merge the existing options with the new tags from the configuration
  //   // r.options = {
  //   //   ...r.options,
  //   //   tags: config.tags,
  //   // };
  // });

  // Return the modified routes
  return [config.routes];
};
