output "state_bucket_name" {
    description = "Output the bucket name"
    value = aws_s3_bucket.ayosdocs-terraform-state.id
}

output "aws_dynamodb_table_name" {
    description = "Output the dynamodb table name"
    value = aws_dynamodb_table.ayosdocs-dynamodb-table.id
}