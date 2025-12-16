import { Injectable } from '@angular/core';
import {
  UrlSerializer,
  DefaultUrlSerializer,
  UrlTree,
  UrlSegmentGroup,
  UrlSegment,
  PRIMARY_OUTLET,
  Params,
} from '@angular/router';

@Injectable()
export class FlowUrlSerializer implements UrlSerializer {
  private defaultSerializer = new DefaultUrlSerializer();

  // URL (string) -> UrlTree
  parse(url: string): UrlTree {
    const tree = this.defaultSerializer.parse(url);
    const root = tree.root;

    const queryParams: Params = { ...tree.queryParams };
    const children = { ...root.children };

    // Turn ?flow0=trading/tabs/home into an aux outlet group on root
    Object.keys(queryParams).forEach((key) => {
      if (/^flow\d+$/.test(key)) {
        const value = queryParams[key] as string;
        delete queryParams[key];

        const segments = value
          .split('/')
          .filter(Boolean)
          .map((p) => new UrlSegment(p, {}));

        children[key] = new UrlSegmentGroup(segments, {});
      }
    });

    // mutate the existing tree instead of constructing a new one
    root.children = children;
    tree.queryParams = queryParams;
    return tree;
  }

  // UrlTree -> URL (string)
  serialize(tree: UrlTree): string {
    const root = tree.root;

    // primary group (for /ai-search)
    const primary = root.children[PRIMARY_OUTLET] ?? root;
    const primaryPath = primary.segments.map((s) => s.path).join('/');
    const base = primaryPath ? `/${primaryPath}` : '/';

    // Collect aux outlets from root.children (siblings of PRIMARY_OUTLET)
    const flowParams: Record<string, string> = {};

    Object.entries(root.children).forEach(([outletName, group]) => {
      if (outletName === PRIMARY_OUTLET) return;
      if (!/^flow\d+$/.test(outletName)) return; // only encode flow* outlets

      const value = group.segments.map((s) => s.path).join('/');
      flowParams[outletName] = value;
    });

    const allQueryParams: Params = {
      ...tree.queryParams,
      ...flowParams,
    };

    const query = this.serializeQueryParams(allQueryParams);
    const fragment =
      tree.fragment != null ? `#${encodeURIComponent(tree.fragment)}` : '';

    return query ? `${base}?${query}${fragment}` : `${base}${fragment}`;
  }

  private serializeQueryParams(params: Params): string {
    const parts: string[] = [];
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v === undefined || v === null) return;
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    });
    return parts.join('&');
  }
}
