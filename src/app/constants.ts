export class Constants{
    public static ProductSearchUrl: string = "http://api.walmartlabs.com/v1/search?query=";
    public static ProductLookupUrl: string = "http://api.walmartlabs.com/v1/items?ids=";
    public static ProductRecommendationUrl: string = "/api/recommendProduct/";
    public static APIKeyPath: string = "assets/json/keys.json";
    public static APIQueryParam: string = "&apiKey="
    public static JSONPSuffix: string = "&callback=JSONP_CALLBACK&format=json";
}